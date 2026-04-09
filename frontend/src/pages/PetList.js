import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import searchIcon from "../assets/search.png";

function normalizePetRecord(record, index) {
  const categories = ["Dog", "Cat", "Rabbit", "Bird", "Hamster"];
  const sizes = ["Small", "Medium", "Large"];
  const statuses = ["Available", "Pending", "Adopted"];

  // Parse age to months
  let ageInMonths = 0;
  if (record.age) {
    const ageStr = record.age.toString().toLowerCase();
    const match = ageStr.match(/(\d+)\s*(month|year)s?/);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2];
      ageInMonths = unit === 'year' ? num * 12 : num;
    }
  } else {
    ageInMonths = (index % 5) + 1; // Default
  }

  // Determine age range
  let ageRange;
  if (ageInMonths < 6) {
    ageRange = "under 6 months";
  } else if (ageInMonths < 12) {
    ageRange = "under 1 year";
  } else if (ageInMonths <= 24) {
    ageRange = "1 year ~ 2 years";
  } else {
    ageRange = "over 2 years";
  }

  return {
    _id: record._id || `pet-${index}`,
    name: record.name || record.title || "Unknown Pet",
    category: record.category || categories[index % categories.length],
    age: record.age || `${ageInMonths} Months`,
    ageRange,
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
      const matchesAge = ageFilter === "All" || pet.ageRange === ageFilter;
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
    if (categoryFilter === "All") {
      return ["All", ...new Set(pets.map((pet) => pet.breed))];
    } else {
      const filteredBreeds = pets
        .filter((pet) => pet.category === categoryFilter)
        .map((pet) => pet.breed);
      return ["All", ...new Set(filteredBreeds)];
    }
  }, [pets, categoryFilter]);

  const ageOptions = useMemo(() => {
    return [
      "All",
      "under 6 months",
      "under 1 year",
      "1 year ~ 2 years",
      "over 2 years"
    ];
  }, []);

  function openPetDetail(pet) {
    navigate(`/pets/${pet._id}`);
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
            <div className="pet-search-input-group">
              <input
                id="pet-search"
                className="pet-filter-search"
                type="text"
                placeholder="Search pets by name, breed, type..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setSearch(search.trim());
                  }
                }}
              />
              <button
                type="button"
                className="pet-search-button"
                onClick={() => setSearch(search.trim())}
                aria-label="Search pets"
              >
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
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

            <label className="pet-check-row">
              <span>Vaccinated</span>
              <input
                type="checkbox"
                checked={vaccinatedOnly}
                onChange={(event) => setVaccinatedOnly(event.target.checked)}
              />
            </label>

            <label className="pet-filter-field">
              <span>Type</span>
              <select
                className="pet-select"
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setBreedFilter("All"); // Reset breed when type changes
                }}
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
                      {isAuthenticated ? (
                        <button
                          className={`pet-favorite-badge ${
                            isAuthenticated && isPetSaved(pet._id) ? "is-saved" : ""
                          }`}
                          type="button"
                          onClick={() => isAuthenticated && toggleSavedPet(pet)}
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
                        <span>{pet.ageRange}</span>
                        <span>{pet.size}</span>
                      </div>

                      <p className="pet-adoption-text">
                        Adopted: {pet.status === "Adopted" ? "Yes" : "No"}
                      </p>

                      <div className="pet-list-card-footer">
                        <span className={`pet-status-badge status-${pet.status.toLowerCase()}`}>
                          {pet.status}
                        </span>

                        {pet.status !== "Adopted" ? (
                          <button
                            className="pet-outline-button"
                            type="button"
                            onClick={() => openPetDetail(pet)}
                          >
                            View More
                          </button>
                        ) : null}

                        {isAuthenticated ? (
                          <button
                            className={`pet-favorite-badge ${
                              isAuthenticated && isPetSaved(pet._id) ? "is-saved" : ""
                            }`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              isAuthenticated && toggleSavedPet(pet);
                            }}
                          >
                            {"\u2665"}
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
