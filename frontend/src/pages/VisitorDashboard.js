import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

function VisitorDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log("VisitorDashboard mounted");
    fetch("http://localhost:5000/api/items")
      .then((res) => {
        console.log("fetch status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("fetched data:", data);
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setItems([]);
      });
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const title = item.title ? item.title.toLowerCase() : "";
      const description = item.description ? item.description.toLowerCase() : "";
      const keyword = search.toLowerCase();

      return title.includes(keyword) || description.includes(keyword);
    });
  }, [items, search]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Item Listing</h1>

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

      <h2 className="pet-title">DATABASE ITEMS</h2>

      <div className="dashboard-layout">
        <div className="sidebar">
          <h3 className="sidebar-title">SEARCH</h3>
          <input
            className="search-input"
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pet-grid">
          {filteredItems.map((item) => (
            <div className="pet-card" key={item._id}>
              <h3>{item.title}</h3>
              <p className="pet-type">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VisitorDashboard;