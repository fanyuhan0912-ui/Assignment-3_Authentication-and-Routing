import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import heroDog from "../assets/flouffy-g2FtlFrc164-unsplash.jpeg";
import adoptionIcon from "../assets/adoption-icon.png";
import postingIcon from "../assets/posting-icon.png";

function normalizePetRecord(record, index) {
  const categories = ["Dog", "Cat", "Rabbit", "Bird", "Hamster"];
  const sizes = ["Small", "Medium", "Large"];
  const statuses = ["Available", "Pending", "Adopted"];

  return {
    _id: record._id || `pet-${index}`,
    name: record.name || record.title || "Unknown Pet",
    category: record.category || categories[index % categories.length],
    age: record.age || `${(index % 5) + 1} Months`,
    breed: record.breed || (record.category || categories[index % categories.length]),
    size: record.size || sizes[index % sizes.length],
    vaccinated: typeof record.vaccinated === "boolean" ? record.vaccinated : index % 2 === 0,
    status: record.status || statuses[index % statuses.length],
    description: record.description || "No description available.",
    image:
      record.image ||
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  };
}

const services = [
  {
    title: "PET ADOPTION",
    description: "Explore available pets and start the adoption journey with confidence.",
    icon: adoptionIcon,
  },
  {
    title: "PET POSTING",
    description: "Share pet stories, updates, and helpful listings with the community.",
    icon: postingIcon,
  },
];

function Home() {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petError, setPetError] = useState("");
  const { isAuthenticated, isPetSaved, toggleSavedPet } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPets() {
      try {
        const endpoints = [
          "http://localhost:5000/api/pets",
          "http://localhost:5000/api/items",
        ];

        for (const endpoint of endpoints) {
          const response = await fetch(endpoint);
          const data = await response.json();

          if (!response.ok) {
            continue;
          }

          setPets(Array.isArray(data) ? data.map(normalizePetRecord) : []);
          setPetError("");
          return;
        }

        throw new Error("Failed to load pets");
      } catch (fetchError) {
        setPetError(fetchError.message || "Failed to load pets");
      } finally {
        setLoadingPets(false);
      }
    }

    fetchPets();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#pet-listing') {
      const element = document.getElementById('pet-listing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const featuredPets = useMemo(() => pets.slice(0, 6), [pets]);

  return (
    <>
      <section className="hero">
        <img className="hero-banner-image" src={heroDog} alt="Golden dog holding a toy" />

        <div className="hero-copy">
          <p className="hero-kicker">
            {isAuthenticated ? "Welcome back to your pet space" : "A gentle place to raise something precious"}
          </p>

          <h1 className="hero-title">
            {isAuthenticated ? "WELCOME BACK" : "MEET YOUR PET"}
          </h1>

          <p className="hero-text">
            {isAuthenticated
              ? "Pick up where you left off, revisit your saved pets, and explore new companions."
              : "Discover lovable companions, keep your favorites close, and build your pet journey with confidence."}
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <button
                  className="hero-action hero-action-secondary"
                  onClick={() => navigate("/user-profile")}
                >
                  Registration History
                </button>
                <button
                  className="hero-action hero-action-secondary"
                  onClick={() => navigate("/saved-pets")}
                >
                  Favorite List
                </button>
              </>
            ) : (
              <button className="hero-action" onClick={() => navigate("/login")}>
                Get Start
              </button>
            )}
          </div>
        </div>

      </section>

      <div className="home-content-surface">
        <section className="services-section">
          <div className="services-header">
            <h2>OUR SERVICE</h2>
            <p>We have three main services for this organization.</p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="service-icon-panel">
                  <img src={service.icon} alt={service.title} />
                </div>

                <div className="service-card-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button
                    className="service-button"
                    onClick={() =>
                      navigate(
                        service.title === "PET POSTING"
                          ? "/registration-form?type=posting"
                          : isAuthenticated
                            ? "/pet-list"
                            : "/login"
                      )
                    }
                  >
                    More Detail
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-pet-section" id="pet-listing">
          <div className="pet-list-heading">
            <h1>PET LISTING</h1>
            <p>
              We update our pet status in real time. The status includes available,
              pending and adopted.
            </p>
          </div>

          {loadingPets ? <div className="content-card"><p>Loading pets...</p></div> : null}
          {petError ? <div className="content-card"><p>{petError}</p></div> : null}

          {!loadingPets && !petError ? (
            <>
              <div className="pet-grid pet-grid-listing">
                {featuredPets.map((pet) => (
                  <article className="pet-list-card" key={pet._id}>
                    <div className="pet-list-image-wrap">
                      <img className="pet-card-image" src={pet.image} alt={pet.name} />
                      {isAuthenticated ? (
                        <button
                          className={`pet-favorite-badge ${
                            isPetSaved(pet._id) ? "is-saved" : ""
                          }`}
                          type="button"
                          onClick={() => toggleSavedPet(pet)}
                        >
                          {"\u2665"}
                        </button>
                      ) : null}
                    </div>

                    <div className="pet-list-card-body">
                      <div className="pet-list-card-heading">
                        <h2>{pet.name}</h2>
                      </div>

                      <div className="pet-list-meta">
                        <span>{pet.category}</span>
                        <span>{pet.age}</span>
                        <span>{pet.size}</span>
                      </div>

                      <div className="pet-list-card-footer">
                        <span className={`pet-status-badge status-${pet.status.toLowerCase()}`}>
                          {pet.status}
                        </span>

                        {pet.status !== "Adopted" ? (
                          <button
                            className="pet-outline-button"
                            type="button"
                            onClick={() =>
                              navigate(`/pets/${pet._id}`)
                            }
                          >
                            View More
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                className="pet-view-more"
                type="button"
                onClick={() => navigate(isAuthenticated ? "/pet-list" : "/login")}
              >
                View More
              </button>
            </>
          ) : null}
        </section>
      </div>
    </>
  );
}

export default Home;
