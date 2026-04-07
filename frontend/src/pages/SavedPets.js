import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function SavedPets() {
  const { savedPets, toggleSavedPet } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <section className="content-page">
      <div className="section-heading">
        <p className="content-eyebrow">Favorite Pets</p>
        <h1>Your favorite pets all in one place.</h1>
      </div>

      {savedPets.length === 0 ? (
        <div className="content-card">
          <p>You have not saved any pets yet.</p>
          <button className="hero-action" onClick={() => navigate("/pet-list")}>
            Browse Pet List
          </button>
        </div>
      ) : (
        <div className="saved-pets-grid">
          {savedPets.map((pet) => (
            <article className="pet-list-card saved-pet-list-card" key={pet._id || pet.id}>
              <div className="pet-list-image-wrap">
                <img className="pet-card-image" src={pet.image} alt={pet.name} />
              </div>

              <div className="pet-list-card-body">
                <div className="pet-list-card-heading">
                  <h2>{pet.name}</h2>
                </div>
                <div className="pet-list-meta">
                  <span>{pet.category}</span>
                  <span>{pet.ageRange}</span>
                  <span>{pet.size || "Small"}</span>
                </div>
                <p className="saved-pet-description">{pet.description}</p>
                <div className="pet-list-card-footer">
                  <button
                    className="pet-favorite-badge is-saved"
                    type="button"
                    onClick={() => toggleSavedPet(pet)}
                  >
                    {"\u2665"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedPets;
