import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Register from "./pages/Register/Register";
import SignIn from "./pages/login/Login";
import Home from "./pages/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Navbar from "./Sharid/NavBar/NavBar";
import WishList from "./views/WishList/WishList";
import Cart from "./views/Cart/Cart";
import Loader from "./views/Loader/Loader";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Verification from "./components/Verification/Verification";
import NotFoundPage from "./views/Error/Error";
import SearchPage from "./views/SearchPage";
import Contact from "./views/Contact/Contact";
import Footer from "./Sharid/Footer/Footer";
import OrderTracking from "./pages/Orders/OrderTracking";
import AboutUs from "./views/AboutUs/AboutUs";
import { Toaster } from "react-hot-toast";
import BrandDetails from "./views/BrandDetails/BrandDetails";
import CategoriesList from "./components/Categories/CategoriesList/CategoriesList";
import CategoryDetails from "./components/Categories/CategoryDetails/CategoryDetails";
import { selectToken } from "./redux/features/authSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setCredentials } from "./redux/features/authSlice";
import { useNavigate } from "react-router-dom";
function App() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      dispatch(setCredentials({ token }));
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/");
    }
  }, []);
  return (
    <div>
      {isLoading && <Loader />}
      <Toaster />
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/VerifyCode" element={<Verification />} />

        {/* User And Protected Pages*/}
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/trackorder"
          element={token ? <OrderTracking /> : <Navigate to="/login" />}
        />
        {/* End User And Protected Pages*/}

        <Route path="/search" element={<SearchPage />} />

        {/* Static Pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />

        {/* ✅ Categories */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />

        {/* Brands */}
        <Route path="/brands/:id" element={<BrandDetails />} />

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
// تعديل صفحة WishLiist من اجل حماية الصفحة ان يتم عرض رسالة يجب تسجيل الدخول اولا مع زر يأخذني ال صفحة Login
// اللوغو بالفوتر تكبي
//
