import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import leftArrow from "../assets/left-arrow.png";

function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          {/* Detailed info list */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <InfoRow label="Age" value={pet.age} />
            <InfoRow label="Gender" value={pet.gender || "Unknown"} />
            <InfoRow label="Vaccination" value={pet.vaccinated ? "Vaccinated" : "Not vaccinated"} />
            <InfoRow label="Size" value={pet.size || "Standard"} />
          </div>

          {/* Description section */}
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#666", marginBottom: "10px" }}>Pet Description</h3>
            <p style={{ color: "#444", lineHeight: "1.6", fontSize: "0.95rem" }}>
              {pet.description || "No description available. This pet is looking for a loving home!"}
            </p>
          </div>

          {/* Bottom button */}
          <button style={{
            marginTop: "auto",
            backgroundColor: themeBlue,
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}>
            Contact / Purchase
          </button>
        </div>
      </div>
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

export default PetDetail;