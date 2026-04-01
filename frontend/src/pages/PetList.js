import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

function PetList() {
  const PETS_PER_STEP = 6;
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [breedFilter, setBreedFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [vaccinatedOnly, setVaccinatedOnly] = useState(false);
  const [pets, setPets] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PETS_PER_STEP);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isPetSaved, toggleSavedPet } = useContext(AuthContext);

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
          setError("");
          return;
        }

        throw new Error("Failed to load pets");
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load pets");
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(keyword) ||
        pet.category.toLowerCase().includes(keyword) ||
        pet.breed.toLowerCase().includes(keyword) ||
        pet.description.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All" || pet.category === categoryFilter;
      const matchesBreed = breedFilter === "All" || pet.breed === breedFilter;
      const matchesSize = sizeFilter === "All" || pet.size === sizeFilter;
      const matchesAge = ageFilter === "All" || pet.age === ageFilter;
      const matchesVaccinated = !vaccinatedOnly || pet.vaccinated;
      const matchesAvailable = !availableOnly || pet.status === "Available";

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBreed &&
        matchesSize &&
        matchesAge &&
        matchesVaccinated &&
        matchesAvailable
      );
    });
  }, [
    pets,
    search,
    categoryFilter,
    breedFilter,
    sizeFilter,
    ageFilter,
    vaccinatedOnly,
    availableOnly,
  ]);

  const visiblePets = useMemo(() => {
    return filteredPets.slice(0, visibleCount);
  }, [filteredPets, visibleCount]);

  useEffect(() => {
    setVisibleCount(PETS_PER_STEP);
  }, [
    search,
    categoryFilter,
    breedFilter,
    sizeFilter,
    ageFilter,
    vaccinatedOnly,
    availableOnly,
  ]);

  const breedOptions = useMemo(() => {
    return ["All", ...new Set(pets.map((pet) => pet.breed))];
  }, [pets]);

  const ageOptions = useMemo(() => {
    return ["All", ...new Set(pets.map((pet) => pet.age))];
  }, [pets]);

  function openAdoptionForm(pet) {
    navigate(
      `/registration-form?type=adoption&petId=${pet._id}&petName=${encodeURIComponent(
        pet.name
      )}`
    );
  }

  return (
    <section className="pet-list-page">
      <div className="pet-list-heading">
        <h1>PET LISTING</h1>
        <p>
          We update our pet status in real time. The status includes available,
          pending and adopted.
        </p>
      </div>

      <div className="pet-list-layout">
        <aside className="pet-filter-panel">
          <div className="pet-search-block">
            <label className="pet-filter-title" htmlFor="pet-search">
              SEARCH
            </label>
            <input
              id="pet-search"
              className="pet-filter-search"
              type="text"
              placeholder=""
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="pet-filter-card">
            <h2>FILTER</h2>

            <label className="pet-check-row">
              <span>Available</span>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
              />
            </label>

            <label className="pet-filter-field">
              <span>Type</span>
              <select
                className="pet-select"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="All">All</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Bird">Bird</option>
              </select>
            </label>

            <label className="pet-filter-field">
              <span>Breed</span>
              <select
                className="pet-select"
                value={breedFilter}
                onChange={(event) => setBreedFilter(event.target.value)}
              >
                {breedOptions.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </label>

            <label className="pet-filter-field">
              <span>Size</span>
              <select
                className="pet-select"
                value={sizeFilter}
                onChange={(event) => setSizeFilter(event.target.value)}
              >
                <option value="All">All</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </label>

            <label className="pet-filter-field">
              <span>Age</span>
              <select
                className="pet-select"
                value={ageFilter}
                onChange={(event) => setAgeFilter(event.target.value)}
              >
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </label>

            <label className="pet-check-row">
              <span>Vaccinated</span>
              <input
                type="checkbox"
                checked={vaccinatedOnly}
                onChange={(event) => setVaccinatedOnly(event.target.checked)}
              />
            </label>

            <button className="pet-filter-apply" type="button">
              Apply
            </button>
          </div>
        </aside>

        <div className="pet-list-results">
          {loading ? <div className="content-card"><p>Loading pets...</p></div> : null}
          {error ? <div className="content-card"><p>{error}</p></div> : null}

          {!loading && !error ? (
            <>
              <div className="pet-grid pet-grid-listing">
                {visiblePets.map((pet) => (
                  <article className="pet-list-card" key={pet._id}>
                    <div className="pet-list-image-wrap">
                      <img className="pet-card-image" src={pet.image} alt={pet.name} />
                      <button
                        className={`pet-favorite-badge ${
                          isAuthenticated && isPetSaved(pet._id) ? "is-saved" : ""
                        }`}
                        type="button"
                        onClick={() => isAuthenticated && toggleSavedPet(pet)}
                      >
                        {"\u2665"}
                      </button>
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

                        {isAuthenticated && pet.status !== "Adopted" ? (
                          <button
                            className="pet-outline-button"
                            type="button"
                            onClick={() => openAdoptionForm(pet)}
                          >
                            Invite
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < filteredPets.length ? (
                <button
                  className="pet-view-more"
                  type="button"
                  onClick={() =>
                    setVisibleCount((currentCount) => currentCount + PETS_PER_STEP)
                  }
                >
                  View More
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PetList;
