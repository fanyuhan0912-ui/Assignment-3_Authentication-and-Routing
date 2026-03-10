import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleCreateItem() {
    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title,
          description: description
        })
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Item created successfully!");
        setTitle("");
        setDescription("");
      } else {
        alert(data.message || "Failed to create item");
      }

    } catch (error) {
      console.error("Create item error:", error);
      alert("Something went wrong");
    }
  }

  return (
    <div>

      <h1>Dashboard</h1>

      <h2>Welcome, {user ? user.username : "User"}!</h2>

      <h3>Create New Item</h3>

      <input
        type="text"
        placeholder="Item Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Item Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleCreateItem}>Create Item</button>

      <br />
      <br />

      <button onClick={handleLogout}>Logout</button>

    </div>
  );
}

export default Dashboard;