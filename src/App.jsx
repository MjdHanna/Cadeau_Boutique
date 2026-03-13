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
import NotFoundPage from "./views/Error/Error";
import SearchPage from "./views/SearchPage/SearchPage";
import Contact from "./views/Contact/Contact";
import Footer from "./Sharid/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import OrderTracking from "./pages/Orders/OrderTracking";
import AboutUs from "./views/AboutUs/AboutUs";
import { Toaster } from "react-hot-toast";
import BrandDetails from "./views/BrandDetails/BrandDetails";
import CategoriesList from "./components/Categories/CategoriesList/CategoriesList";
import CategoryDetails from "./components/Categories/CategoryDetails/CategoryDetails";
import { selectToken } from "./redux/features/authSlice";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setCredentials } from "./redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import OccasionDetails from "./components/OccassionDetails/OccassionDetails";
import VerifyResetCode from "./views/VerifyResetCode/VerifyResetCode";
import GoogleCallback from "./pages/auth/GoogleCallback";
import VerifyEmail from "./pages/auth/VerifyEmail";
import i18n from "./i18n";
import { selectTranslate } from "./redux/features/translateSlice";
import Profile from "./pages/Profile/Profile";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import FilterSidebar from "./pages/FilterSidebar/FilterSidebar";
import SearchLayout from "./pages/SearchLayout/SearchLayout";

function App() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const token = useSelector(selectToken);
  const language = useSelector(selectTranslate);

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
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  const [filters, setFilters] = useState({
    categoryId: "",
    brandId: "",
    occasionId: "",
    minPrice: "",
    maxPrice: "",
    color: "",
    size: "",
    name: "",
  });
  return (
    <div>
      {isLoading && <Loader />}
      <Toaster />
      <Navbar />
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-reset-code" element={<VerifyResetCode />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* User And Protected Pages*/}
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderTracking />} />
        <Route path="/search" element={<SearchLayout />} />

        {/* Static Pages */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />

        {/* ✅ Categories */}
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />

        {/* Brands */}
        <Route path="/brands/:id" element={<BrandDetails />} />
        {/* Occasion */}
        <Route path="/occasions/:id" element={<OccasionDetails />} />
        {/* Products */}
        <Route path="/products/:id" element={<ProductDetails />} />
        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
