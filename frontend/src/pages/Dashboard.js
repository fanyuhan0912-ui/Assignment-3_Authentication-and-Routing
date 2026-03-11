import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // FIRST 5 PETS FROM YOUR CSV
  // Paste image URLs into the image field
  const demoPets = [
    {
      id: 500,
      name: "Sky",
      type: "Bird",
      breed: "Parakeet",
      ageMonths: 131,
      color: "Orange",
      size: "Large",
      adoptionFee: 140,
      image: "https://i.pinimg.com/1200x/7b/18/6b/7b186b820267265d55cf3e306128b9b6.jpg",
      link: "",
    },
    {
      id: 501,
      name: "Hazel",
      type: "Rabbit",
      breed: "Rabbit",
      ageMonths: 73,
      color: "White",
      size: "Large",
      adoptionFee: 235,
      image: "https://i.pinimg.com/avif/736x/c8/09/0d/c8090dc7ef8532910c2a50e516b43f06.avf",
      link: "",
    },
    {
      id: 502,
      name: "Buddy",
      type: "Dog",
      breed: "Golden Retriever",
      ageMonths: 136,
      color: "Orange",
      size: "Medium",
      adoptionFee: 385,
      image: "https://i.pinimg.com/736x/c3/e0/86/c3e0860f8f8f2682d45fc93cf832aaa3.jpg",
      link: "",
    },
    {
      id: 503,
      name: "Sunny",
      type: "Bird",
      breed: "Parakeet",
      ageMonths: 97,
      color: "White",
      size: "Small",
      adoptionFee: 217,
      image: "https://i.pinimg.com/avif/1200x/57/66/5a/57665ae87080aacfab1056ea1591e6c7.avf",
      link: "",
    },
    {
      id: 504,
      name: "Coco",
      type: "Rabbit",
      breed: "Rabbit",
      ageMonths: 123,
      color: "Gray",
      size: "Large",
      adoptionFee: 14,
      image: "https://i.pinimg.com/736x/43/05/c3/4305c3a38250f24c315f420a7a422334.jpg",
      link: "",
    },
  ];

  const filteredPets = useMemo(() => {
    return demoPets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.type.toLowerCase().includes(search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedType === "All" || pet.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>
          Welcome Back,{" "}
          {user
            ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
            : "User"}
          !
        </h1>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 className="pet-title">PET LISTING</h2>

      <div className="dashboard-layout">
        {/* LEFT SIDEBAR */}
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

          <div className="filter-box">
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

            <button className="apply-btn">Apply</button>
          </div>
        </div>

        {/* PET GRID */}
        <div className="pet-grid">
          {filteredPets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <img className="pet-image" src={pet.image} alt={pet.name} />

              <h3>{pet.name}</h3>

              <p className="pet-type">{pet.type}</p>

              <a
                className="details-btn"
                href={pet.link}
                target="_blank"
                rel="noreferrer"
              >
                Invite
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
