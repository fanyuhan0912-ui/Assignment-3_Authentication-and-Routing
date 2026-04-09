import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import leftArrow from "../assets/left-arrow.png";

function PetDetail() {
  const { id } = useParams();
  const { registrations } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Assume your theme blue is this, adjust if needed
  const themeBlue = "#7fa5d7"; 

  useEffect(() => {
    fetch(`http://localhost:5000/api/pets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch pet details");
        return res.json();
      })
      .then((data) => {
        setPet(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Could not load pet details.");
        setLoading(false);
      });
  }, [id]);

  function hasRegistrationHistory() {
    return Array.isArray(registrations) && registrations.length > 0;
  }

  function getLatestRegistration() {
    if (!Array.isArray(registrations) || registrations.length === 0) {
      return null;
    }

    return [...registrations].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  }

  function handleContactClick() {
    if (!hasRegistrationHistory()) {
      navigate("/registration-form?type=adoption");
      return;
    }

    setShowPhoneModal(true);
  }

  function closePhoneModal() {
    setShowPhoneModal(false);
  }

  const isAdopted = pet?.status === "Adopted";

  if (loading) return <h2 style={{ padding: "50px", textAlign: "center" }}>Loading...</h2>;
  if (error) return <h2 style={{ padding: "50px", textAlign: "center", color: "red" }}>{error}</h2>;
  if (!pet) return <h2 style={{ padding: "50px", textAlign: "center" }}>Pet not found</h2>;

  return (
    <div style={{ backgroundColor: "#fdfbf9", minHeight: "100vh", padding: "40px 20px" }}>
      {/* back button*/}
      <div style={{ maxWidth: "1000px", margin: "0 auto 20px" }}>
        <Link to="/#pet-listing" style={{ color: "#000000", textDecoration: "none", fontSize: "18px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <img src={leftArrow} alt="Back" style={{ width: "15px", height: "15px" }} />
          Back to Home
        </Link>
      </div>

      {/* Main container: left-right layout based on reference image */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        gap: "40px",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        flexWrap: "wrap"
      }}>
        
        {/* Left side: large image */}
        <div style={{ flex: "1.2", minWidth: "300px" }}>
          <img
            src={pet.image}
            alt={pet.name}
            style={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              borderRadius: "15px",
            }}
          />

          {pet.location && pet.location.address && (() => {
            const latitude = pet.location.latitude ?? pet.location.lat;
            const longitude = pet.location.longitude ?? pet.location.lng;
            const mapsQuery = latitude && longitude
              ? `${latitude},${longitude}`
              : encodeURIComponent(pet.location.address);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

            return (
              <div style={{ marginTop: "18px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #d8e4f5",
                    backgroundColor: "#f8fbff",
                    boxShadow: "0 6px 18px rgba(31, 45, 82, 0.05)",
                    marginBottom: "12px",
                    cursor: "pointer"
                  }}
                  onClick={() => window.open(mapsUrl, "_blank")}
                >
                  {latitude && longitude ? (
                    <iframe
                      title="Pet location preview"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
                      style={{ width: "100%", height: "100%", border: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b"
                    }}>
                      Map preview unavailable
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => window.open(mapsUrl, "_blank")}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    backgroundColor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#2563eb",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span style={{ fontSize: "18px" }}>📍</span>
                  <span>
                    {pet.location.address}
                    <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "4px" }}>
                      Open in Google Maps
                    </div>
                  </span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* Right side: details */}
        <div style={{ flex: "1", minWidth: "300px", display: "flex", flexDirection: "column" }}>
          <h1 style={{ margin: "0 0 15px 0", fontSize: "2rem", color: "#333" }}>{pet.name}</h1>
          
          {/* Tag bar */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <span style={tagStyle(themeBlue)}>{pet.category}</span>
            <span style={tagStyle("#e8f4ff", themeBlue)}>{pet.breed || "Unknown variety"}</span>
            <span style={tagStyle("#f0fdf4", "#5fb980")}>{pet.status || "For Sale"}</span>
          </div>

          {/* Price (if this is a pet sales app) */}
          <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: themeBlue, marginBottom: "25px" }}>
            {pet.price ? `¥${pet.price}` : "Price upon request"}
          </div>

          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              borderRadius: "12px",
              backgroundColor: isAdopted ? "#eef4ff" : "#f3fbf5",
              color: isAdopted ? "#5f7fb2" : "#3f7d52",
              fontWeight: 600,
            }}
          >
            Adopted: {isAdopted ? "Yes" : "No"}
          </div>

          {/* Detailed info list */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <InfoRow label="Age" value={pet.age} />
            <InfoRow label="Gender" value={pet.gender || "Unknown"} />
            <InfoRow label="Vaccination" value={pet.vaccinated ? "Vaccinated" : "Not vaccinated"} />
            <InfoRow label="Size" value={pet.size || "Standard"} />
            <InfoRow label="Adoption status" value={pet.status || "Available"} />
          </div>

          {/* Description section */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>Pet Description</h3>
            <p style={{ color: "#444", lineHeight: "1.6", fontSize: "0.95rem" }}>
              {pet.description || "No description available. This pet is looking for a loving home!"}
            </p>
          </div>

          {/* Bottom button */}
          <button
            type="button"
            onClick={handleContactClick}
            disabled={isAdopted}
            style={{
              marginTop: "auto",
              backgroundColor: isAdopted ? "#b8c6da" : themeBlue,
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: isAdopted ? "not-allowed" : "pointer",
              opacity: isAdopted ? 0.75 : 1,
              transition: "opacity 0.2s"
            }}
          >
            {isAdopted ? "Already Adopted" : "Contact / Purchase"}
          </button>
        </div>
      </div>

      {showPhoneModal ? (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: 0, marginBottom: "12px" }}>Contact Phone</h2>
            <p style={{ marginBottom: "20px", color: "#333" }}>
              {pet.phonenumber|| "No phone number found."}
            </p>
            <button
              type="button"
              onClick={closePhoneModal}
              style={modalButtonStyle}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Helper component: info row
const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #f9f9f9" }}>
    <span style={{ width: "100px", color: "#999" }}>{label}：</span>
    <span style={{ color: "#333" }}>{value}</span>
  </div>
);

// Supplementary style: Label
const tagStyle = (bgColor, textColor = "#fff") => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: "4px 12px",
  borderRadius: "6px",
  fontSize: "0.85rem",
  border: textColor !== "#fff" ? `1px solid ${textColor}44` : "none"
});

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "min(420px, 90vw)",
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 18px 45px rgba(0, 0, 0, 0.12)",
  textAlign: "center",
};

const modalButtonStyle = {
  padding: "12px 22px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 600,
};

export default PetDetail;
