import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedToken ? jwtDecode(storedToken) : null);

  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(jwtDecode(newToken));
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}