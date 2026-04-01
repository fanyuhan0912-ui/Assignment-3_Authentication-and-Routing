import { useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/meetmypet-logo.png";
import Footer from "./Footer";

function Navigation() {
  const { isAuthenticated, logout, profile, user } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <img className="brand-logo" src={logo} alt="Meet My Pet logo" />
        </Link>

        <nav className="site-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/pet-list">Pet List</NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/saved-pets">Favorite Pets</NavLink>
              <NavLink className="site-user site-user-link" to="/user-profile">
                Hi! {profile?.displayName || user?.username || "User"}
              </NavLink>
              <button className="site-auth-link" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink className="site-auth-link" to="/login">
              Sign In
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Navigation;
