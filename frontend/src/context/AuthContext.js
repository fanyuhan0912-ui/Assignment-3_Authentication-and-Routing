import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/meetmypet-logo.png";

export const AuthContext = createContext();
const defaultProfileImage = logo;
const authApiBase = "http://localhost:5000/api/auth";
const registrationsApiBase = "http://localhost:5000/api/registrations";

function getStoredUser(token) {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");
  const storedUser = getStoredUser(storedToken);
  const storedAdoptionHistory = localStorage.getItem("adoptionHistory");

  const [token, setToken] = useState(storedUser ? storedToken : null);
  const [user, setUser] = useState(storedUser);
  const [savedPets, setSavedPets] = useState([]);
  const [profile, setProfile] = useState({
    displayName: storedUser?.username || "",
    profileImage: defaultProfileImage,
    signInDate: null,
  });
  const [adoptionHistory, setAdoptionHistory] = useState(
    storedAdoptionHistory ? JSON.parse(storedAdoptionHistory) : []
  );
  const [registrations, setRegistrations] = useState([]);

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setProfile({
      displayName: "",
      profileImage: defaultProfileImage,
      signInDate: null,
    });
    setSavedPets([]);
    setRegistrations([]);
  }

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setSavedPets([]);
        setRegistrations([]);
        return;
      }

      try {
        const [userResponse, registrationsResponse] = await Promise.all([
          fetch(`${authApiBase}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(registrationsApiBase, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!userResponse.ok || !registrationsResponse.ok) {
          if (userResponse.status === 401 || userResponse.status === 403) {
            logout();
            return;
          }
          throw new Error("Failed to load user data");
        }

        const [userData, registrationData] = await Promise.all([
          userResponse.json(),
          registrationsResponse.json(),
        ]);

        setProfile({
          displayName: userData.user?.displayName || userData.user?.username || "",
          profileImage: userData.user?.profileImage || defaultProfileImage,
          signInDate: userData.user?.signInDate || null,
          role: userData.user?.role || "user",
        });
        setSavedPets(Array.isArray(userData.user?.savedPets) ? userData.user.savedPets : []);
        setRegistrations(Array.isArray(registrationData) ? registrationData : []);
      } catch (error) {
        logout();
      }
    }

    loadCurrentUser();
  }, [token]);

  function login(newToken) {
    const decodedUser = jwtDecode(newToken);
    const nextProfile = {
      displayName: decodedUser.username || "",
      profileImage: defaultProfileImage,
      signInDate: null,
      role: "user", // Default role, will be updated when /me is called
    };

    localStorage.setItem("token", newToken);
    localStorage.removeItem("savedPets");
    setToken(newToken);
    setUser(decodedUser);
    setProfile(nextProfile);
  }

  async function updateProfile(updates) {
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${authApiBase}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile({
        displayName: data.profile?.displayName || user?.username || "",
        profileImage: data.profile?.profileImage || defaultProfileImage,
        signInDate: data.profile?.signInDate || null,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function toggleSavedPet(pet) {
    if (!token) {
      return;
    }

    const petId = pet._id || pet.id;

    try {
      const response = await fetch(`${authApiBase}/saved-pets/${petId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite pets");
      }

      const data = await response.json();
      setSavedPets(Array.isArray(data.savedPets) ? data.savedPets : []);
    } catch (error) {
      console.error(error);
    }
  }

  function isPetSaved(petId) {
    return savedPets.some((pet) => (pet._id || pet.id) === petId);
  }

  function addAdoptionHistory(entry) {
    setAdoptionHistory((currentHistory) => {
      const nextHistory = [
        {
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          ...entry,
        },
        ...currentHistory,
      ];

      localStorage.setItem("adoptionHistory", JSON.stringify(nextHistory));
      return nextHistory;
    });
  }

  async function submitRegistration(registrationPayload) {
    if (!token) {
      return { success: false, message: "Please sign in first." };
    }

    try {
      const response = await fetch(registrationsApiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registrationPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit registration");
      }

      const savedRegistration = await response.json();
      setRegistrations((current) => [savedRegistration, ...current]);
      return { success: true, registration: savedRegistration };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: error.message || "Failed to submit registration",
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        isAuthenticated: Boolean(token),
        savedPets,
        adoptionHistory,
        registrations,
        login,
        logout,
        updateProfile,
        toggleSavedPet,
        isPetSaved,
        addAdoptionHistory,
        submitRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
