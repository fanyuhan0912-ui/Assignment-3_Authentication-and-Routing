import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

function VisitorDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const demoPets = [
    {
      id: 500,
      name: "Sky",
      type: "Bird",
      image: "https://i.pinimg.com/1200x/7b/18/6b/7b186b820267265d55cf3e306128b9b6.jpg",
    },
    {
      id: 501,
      name: "Hazel",
      type: "Rabbit",
      image: "https://i.pinimg.com/736x/43/05/c3/4305c3a38250f24c315f420a7a422334.jpg",
    },
    {
      id: 502,
      name: "Buddy",
      type: "Dog",
      image: "https://i.pinimg.com/736x/c3/e0/86/c3e0860f8f8f2682d45fc93cf832aaa3.jpg",
    },
    {
      id: 503,
      name: "Sunny",
      type: "Bird",
      image: "https://i.pinimg.com/1200x/57/66/5a/57665ae87080aacfab1056ea1591e6c7.jpg",
    },
    {
      id: 504,
      name: "Coco",
      type: "Rabbit",
      image: "https://i.pinimg.com/736x/43/05/c3/4305c3a38250f24c315f420a7a422334.jpg",
    },
  ];

  const filteredPets = useMemo(() => {
    return demoPets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.type.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === "All" || pet.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1>Meet Your Pet</h1>

        <div>
          <button
            className="logout-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="logout-btn"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

      </div>

      <h2 className="pet-title">PET LISTING</h2>

      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <div className="sidebar">

          <h3 className="sidebar-title">SEARCH</h3>

          <input
            className="search-input"
            type="text"
            placeholder="Search pets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <h3 className="sidebar-title">FILTER (TYPE)</h3>

          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Dog">Dog</option>
          </select>

        </div>

        {/* PET GRID */}
        <div className="pet-grid">

          {filteredPets.map((pet) => (

            <div className="pet-card" key={pet.id}>

              <img
                className="pet-image"
                src={pet.image}
                alt={pet.name}
              />

              <h3>{pet.name}</h3>

              <p className="pet-type">{pet.type}</p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default VisitorDashboard;