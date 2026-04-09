import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { profile, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

  useEffect(() => {
    if (profile.role !== "admin") {
      setError("Access denied. Admin privileges required.");
      setLoading(false);
      return;
    }
    loadDashboardData();
  }, [profile.role]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, petsRes, regsRes] = await Promise.all([
        fetch(`${apiBase}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/admin/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/admin/registrations`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!statsRes.ok || !usersRes.ok || !petsRes.ok || !regsRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const [statsData, usersData, petsData, regsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        petsRes.json(),
        regsRes.json(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setPets(petsData);
      setRegistrations(regsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${apiBase}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update user role");

      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert("Error updating user role: " + err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${apiBase}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const deletePet = async (petId) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const response = await fetch(`${apiBase}/admin/pets/${petId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete pet");

      setPets(pets.filter(pet => pet._id !== petId));
    } catch (err) {
      alert("Error deleting pet: " + err.message);
    }
  };

  const updatePetStatus = async (petId, status) => {
    try {
      const response = await fetch(`${apiBase}/admin/pets/${petId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update pet status");

      const updatedPet = await response.json();

      setPets(pets.map((pet) => (
        pet._id === petId ? updatedPet : pet
      )));
    } catch (err) {
      alert("Error updating pet status: " + err.message);
    }
  };

  const updateRegistrationStatus = async (regId, status) => {
    try {
      const response = await fetch(`${apiBase}/admin/registrations/${regId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approvalStatus: status }),
      });

      if (!response.ok) throw new Error("Failed to update registration status");

      setRegistrations(registrations.map(reg =>
        reg._id === regId ? { ...reg, approvalStatus: status } : reg
      ));
    } catch (err) {
      alert("Error updating registration: " + err.message);
    }
  };

  const deleteRegistration = async (regId) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;

    try {
      const response = await fetch(`${apiBase}/admin/registrations/${regId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete registration");

      setRegistrations(registrations.filter(reg => reg._id !== regId));
    } catch (err) {
      alert("Error deleting registration: " + err.message);
    }
  };

  const viewRegistrationDetail = (registration) => {
    setSelectedRegistration(registration);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRegistration(null);
  };

  const adoptionRegistrations = registrations.filter(
    (registration) => registration.formType === "adoption"
  );
  const postingRegistrations = registrations.filter(
    (registration) => registration.formType === "posting"
  );

  const renderRegistrationTable = (registrationList, emptyMessage) => {
    if (registrationList.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Pet</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrationList.map((reg) => (
            <tr key={reg._id}>
              <td>{reg.user?.username || "Unknown"}</td>
              <td>{reg.petName}</td>
              <td>
                <select
                  value={reg.approvalStatus}
                  onChange={(e) => updateRegistrationStatus(reg._id, e.target.value)}
                >
                  <option value="Waiting">Waiting</option>
                  <option value="Approved">Approved</option>
                </select>
              </td>
              <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="detail-btn"
                  onClick={() => viewRegistrationDetail(reg)}
                >
                  View Detail
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteRegistration(reg._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return <div className="admin-dashboard"><div className="loading">Loading dashboard...</div></div>;
  }

  if (error) {
    return <div className="admin-dashboard"><div className="error">{error}</div></div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          Statistics
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={activeTab === "pets" ? "active" : ""}
          onClick={() => setActiveTab("pets")}
        >
          Pets ({pets.length})
        </button>
        <button
          className={activeTab === "registrations" ? "active" : ""}
          onClick={() => setActiveTab("registrations")}
        >
          Registrations ({registrations.length})
        </button>
      </div>

      {activeTab === "stats" && stats && (
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Pets</h3>
            <p className="stat-number">{stats.totalPets}</p>
          </div>
          <div className="stat-card">
            <h3>Total Registrations</h3>
            <p className="stat-number">{stats.totalRegistrations}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Registrations</h3>
            <p className="stat-number">{stats.pendingRegistrations}</p>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="users-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "pets" && (
        <div className="pets-section">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Breed</th>
                <th>Adopted</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(pet => (
                <tr key={pet._id}>
                  <td>{pet.name}</td>
                  <td>{pet.type || pet.category || "Unknown"}</td>
                  <td>{pet.breed}</td>
                  <td>
                    <span className={`pet-adoption-indicator ${pet.status === "Adopted" ? "is-adopted" : "is-available"}`}>
                      {pet.status === "Adopted" ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={pet.status || "Available"}
                      onChange={(e) => updatePetStatus(pet._id, e.target.value)}
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  </td>
                  <td>{pet.createdBy?.username || "Unknown"}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deletePet(pet._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "registrations" && (
        <div className="registrations-section">
          <div className="registration-group">
            <div className="registration-group-heading">
              <h2>Pet Posting Applications</h2>
              <span>{postingRegistrations.length}</span>
            </div>
            {renderRegistrationTable(
              postingRegistrations,
              "No pet posting applications received yet."
            )}
          </div>

          <div className="registration-group">
            <div className="registration-group-heading">
              <h2>Pet Adoption Applications</h2>
              <span>{adoptionRegistrations.length}</span>
            </div>
            {renderRegistrationTable(
              adoptionRegistrations,
              "No pet adoption applications received yet."
            )}
          </div>
        </div>
      )}

      {showDetailModal && selectedRegistration && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeDetailModal}>×</button>
            <h2>Registration Details</h2>

            <div className="detail-section">
              <h3>User Information</h3>
              <div className="detail-group">
                <div className="detail-field">
                  <label>Application Type:</label>
                  <p>
                    {selectedRegistration.formType === "posting"
                      ? "Pet Posting"
                      : "Pet Adoption"}
                  </p>
                </div>
                <div className="detail-field">
                  <label>Username:</label>
                  <p>{selectedRegistration.user?.username || "Unknown"}</p>
                </div>
                <div className="detail-field">
                  <label>Full Name:</label>
                  <p>{selectedRegistration.fullName}</p>
                </div>
                <div className="detail-field">
                  <label>Email:</label>
                  <p>{selectedRegistration.email}</p>
                </div>
                <div className="detail-field">
                  <label>Phone:</label>
                  <p>{selectedRegistration.phoneNumber}</p>
                </div>
                <div className="detail-field">
                  <label>Address:</label>
                  <p>{selectedRegistration.homeAddress}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Pet Information</h3>
              <div className="detail-group">
                <div className="detail-field">
                  <label>Pet Name:</label>
                  <p>{selectedRegistration.petName}</p>
                </div>
                <div className="detail-field">
                  <label>Type:</label>
                  <p>{selectedRegistration.petType}</p>
                </div>
                <div className="detail-field">
                  <label>Breed:</label>
                  <p>{selectedRegistration.petBreed}</p>
                </div>
                <div className="detail-field">
                  <label>Age:</label>
                  <p>{selectedRegistration.petAge}</p>
                </div>
                <div className="detail-field">
                  <label>Weight:</label>
                  <p>{selectedRegistration.petWeight}</p>
                </div>
                <div className="detail-field">
                  <label>Vaccinated:</label>
                  <p>{selectedRegistration.vaccinated}</p>
                </div>
                <div className="detail-field">
                  <label>Health Condition:</label>
                  <p>{selectedRegistration.petHealthCondition}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Additional Notes</h3>
              <p>{selectedRegistration.note || "No notes"}</p>
            </div>

            <div className="detail-section">
              <h3>Uploaded Documents</h3>
              <div className="documents-grid">
                {selectedRegistration.idDocument && selectedRegistration.idDocument.dataUrl && (
                  <div className="document-item">
                    <label>ID Document</label>
                    {selectedRegistration.idDocument.mimeType && selectedRegistration.idDocument.mimeType.startsWith('image/') ? (
                      <img 
                        src={selectedRegistration.idDocument.dataUrl} 
                        alt="ID Document" 
                        className="detail-image"
                      />
                    ) : (
                      <a 
                        href={selectedRegistration.idDocument.dataUrl} 
                        download={selectedRegistration.idDocument.fileName || "ID-Document"}
                        className="file-download-btn"
                      >
                        📥 Download {selectedRegistration.idDocument.fileName || "ID Document"}
                      </a>
                    )}
                  </div>
                )}

                {selectedRegistration.proofOfFunds && selectedRegistration.proofOfFunds.dataUrl && (
                  <div className="document-item">
                    <label>Proof of Funds</label>
                    {selectedRegistration.proofOfFunds.mimeType && selectedRegistration.proofOfFunds.mimeType.startsWith('image/') ? (
                      <img 
                        src={selectedRegistration.proofOfFunds.dataUrl} 
                        alt="Proof of Funds" 
                        className="detail-image"
                      />
                    ) : (
                      <a 
                        href={selectedRegistration.proofOfFunds.dataUrl} 
                        download={selectedRegistration.proofOfFunds.fileName || "Proof-of-Funds"}
                        className="file-download-btn"
                      >
                        📥 Download {selectedRegistration.proofOfFunds.fileName || "Proof of Funds"}
                      </a>
                    )}
                  </div>
                )}

                {selectedRegistration.petImage && selectedRegistration.petImage.dataUrl && (
                  <div className="document-item">
                    <label>Pet Image</label>
                    {selectedRegistration.petImage.mimeType && selectedRegistration.petImage.mimeType.startsWith('image/') ? (
                      <img 
                        src={selectedRegistration.petImage.dataUrl} 
                        alt="Pet" 
                        className="detail-image"
                      />
                    ) : (
                      <a 
                        href={selectedRegistration.petImage.dataUrl} 
                        download={selectedRegistration.petImage.fileName || "Pet-Image"}
                        className="file-download-btn"
                      >
                        📥 Download {selectedRegistration.petImage.fileName || "Pet Image"}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Registration Status</h3>
              <div className="detail-group">
                <div className="detail-field">
                  <label>Status:</label>
                  <select 
                    value={selectedRegistration.approvalStatus}
                    onChange={(e) => {
                      updateRegistrationStatus(selectedRegistration._id, e.target.value);
                      setSelectedRegistration({
                        ...selectedRegistration,
                        approvalStatus: e.target.value
                      });
                    }}
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

