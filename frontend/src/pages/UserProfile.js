import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  return new Date(dateValue).toLocaleString();
}

function getRegistrationStatus(statusValue) {
  return statusValue === "Approved" ? "Approved" : "Waiting";
}

function UserProfile() {
  const { user, profile, savedPets, registrations, updateProfile } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(
    profile?.displayName || user?.username || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const profileImage = useMemo(() => {
    return profile?.profileImage || "";
  }, [profile?.profileImage]);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      await updateProfile({ profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    const success = await updateProfile({ displayName });
    if (success) {
      setIsEditing(false);
    }
  }

  return (
    <section className="content-page">
      <div className="section-heading profile-heading">
        <p className="content-eyebrow">
          Welcome, {profile?.displayName || user?.username || "User"}
        </p>
        <h1>User Profile</h1>
      </div>

      <div className="profile-history-card">
        <div className="profile-summary">
          <div className="profile-image-wrap">
            <img
              className="profile-image"
              src={profileImage}
              alt={displayName || "Profile"}
            />
          </div>

          <div className="profile-details">
            <h2>{profile?.displayName || user?.username || "User"}</h2>
            <p><strong>Username:</strong> {user?.username || "Not available"}</p>
            <p><strong>Sign in date:</strong> {formatDate(profile?.signInDate)}</p>
            <p><strong>Favorite pets:</strong> {savedPets.length}</p>
            <button
              className="hero-action hero-action-secondary profile-edit-button"
              type="button"
              onClick={() => setIsEditing((currentValue) => !currentValue)}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

            {isEditing ? (
              <form className="profile-form" onSubmit={handleProfileSave}>
                <h2>Edit Profile</h2>
                <label className="profile-label">
                  Name
                  <input
                    className="profile-input"
                    type="text"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Enter your display name"
                  />
                </label>

                <label className="profile-label">
                  Profile image
                  <input
                    className="profile-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

                <button className="hero-action" type="submit">
                  Save Profile
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      <div className="profile-bottom-grid">
        <div className="content-card registration-section">
          <h2>Registration Form History</h2>
          {registrations.length === 0 ? (
            <p>You have not submitted a registration form yet.</p>
          ) : (
            <div className="history-list">
              {registrations.map((entry) => (
                <div className="history-item" key={entry._id}>
                  <img
                    src={entry.petImage?.dataUrl || entry.petId?.image || profileImage}
                    alt={entry.petName}
                  />
                  <div>
                    <h3>{entry.petName}</h3>
                    <p><strong>Pet:</strong> {entry.petName}</p>
                    <p><strong>When Adopt:</strong> {formatDate(entry.createdAt)}</p>
                    <div className="history-status-row">
                      <strong>Adopt Status:</strong>
                      <span
                        className={`pet-status-badge ${
                          getRegistrationStatus(entry.approvalStatus) === "Approved"
                            ? "status-approved"
                            : "status-waiting"
                        }`}
                      >
                        {getRegistrationStatus(entry.approvalStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="content-card registration-section">
          <h2>Favorite Pet Information</h2>
          {savedPets.length === 0 ? (
            <p>No saved pets yet.</p>
          ) : (
            <div className="profile-saved-grid">
              {savedPets.map((pet) => (
                <article
                  className="pet-list-card profile-saved-list-card"
                  key={pet._id || pet.id}
                >
                  <div className="pet-list-image-wrap">
                    <img src={pet.image} alt={pet.name} className="pet-card-image" />
                  </div>
                  <div className="pet-list-card-body">
                    <h3>{pet.name}</h3>
                    <div className="pet-list-meta">
                      <span>{pet.category}</span>
                      <span>{pet.age}</span>
                      <span>{pet.size || "Small"}</span>
                    </div>
                    <p className="pet-adoption-text">
                      Adopted: {pet.status === "Adopted" ? "Yes" : "No"}
                    </p>
                    <p className="saved-pet-description">{pet.description}</p>
                    <div className="pet-list-card-footer">
                      <span className="pet-status-badge status-available">Favorite</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
