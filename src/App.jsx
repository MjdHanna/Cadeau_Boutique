import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import SignIn from "./pages/login/Login";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
