import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import PetList from "./pages/PetList";
import SavedPets from "./pages/SavedPets";
import UserProfile from "./pages/UserProfile";
import RegistrationForm from "./pages/RegistrationForm";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";


import PetDetail from "./pages/PetDetail";
import "./styles/base.css";
import "./styles/auth.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/about.css";
import "./styles/pets.css";
import "./styles/profile.css";
import "./styles/registration.css";
import "./styles/responsive.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navigation />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pet-list" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/saved-pets" element={<SavedPets />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/registration-form" element={<RegistrationForm />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
          </Route>
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
