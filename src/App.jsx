import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import SignIn from "./pages/login/Login";
import Home from "./pages/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Navbar from "./components/NavBar/NavBar";
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
