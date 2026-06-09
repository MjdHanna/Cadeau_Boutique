import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loader from "./views/Loader/Loader";
import Navbar from "./Sharid/NavBar/NavBar";
import Footer from "./Sharid/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import { Toaster } from "react-hot-toast";
import { setCredentials, selectToken } from "./redux/features/authSlice";
import { selectTranslate } from "./redux/features/translateSlice";
import i18n from "./i18n";

const Home = lazy(() => import("./pages/Home/Home"));

const Register = lazy(() => import("./pages/Register/Register"));
const SignIn = lazy(() => import("./pages/login/Login"));

const ForgotPassword = lazy(
  () => import("./components/ForgotPassword/ForgotPassword"),
);

const ResetPassword = lazy(
  () => import("./components/ResetPassword/ResetPassword"),
);

const VerifyResetCode = lazy(
  () => import("./views/VerifyResetCode/VerifyResetCode"),
);

const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

const GoogleCallback = lazy(() => import("./pages/auth/GoogleCallback"));

const Profile = lazy(() => import("./pages/Profile/Profile"));

const WishList = lazy(() => import("./views/WishList/WishList"));

const Cart = lazy(() => import("./views/Cart/Cart"));

const OrderTracking = lazy(() => import("./pages/Orders/OrderTracking"));

const Friends = lazy(() => import("./pages/Friends"));

const FriendWishlist = lazy(
  () => import("./views/FriendWishlist/FriendWishlist"),
);

const Notifications = lazy(() => import("./pages/Notifications/Notifications"));

const Contact = lazy(() => import("./views/Contact/Contact"));

const AboutUs = lazy(() => import("./views/AboutUs/AboutUs"));

const SearchLayout = lazy(() => import("./pages/SearchLayout/SearchLayout"));

const CategoriesList = lazy(
  () => import("./components/Categories/CategoriesList/CategoriesList"),
);

const CategoryDetails = lazy(
  () => import("./components/Categories/CategoryDetails/CategoryDetails"),
);

const BrandDetails = lazy(() => import("./views/BrandDetails/BrandDetails"));

const OccasionDetails = lazy(
  () => import("./components/OccassionDetails/OccassionDetails"),
);

const ProductDetails = lazy(
  () => import("./pages/ProductDetails/ProductDetails"),
);

const GiftCardsHome = lazy(() => import("./pages/GiftCards/GiftCardsHome"));

const CreateGiftCard = lazy(() => import("./pages/GiftCards/CreateGiftCard"));

const SentGiftCards = lazy(() => import("./pages/GiftCards/SentGiftCards"));

const ReceivedGiftCards = lazy(
  () => import("./pages/GiftCards/ReceivedGiftCards"),
);

const RedeemGiftCard = lazy(() => import("./pages/GiftCards/RedeemGiftCard"));

const NotFoundPage = lazy(() => import("./views/Error/Error"));

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
  }, [dispatch, navigate]);

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

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/friends/:id/wishlist" element={<FriendWishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/search" element={<SearchLayout />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />

          <Route path="/gift-cards" element={<GiftCardsHome />} />
          <Route path="/gift-cards/create" element={<CreateGiftCard />} />
          <Route path="/gift-cards/sent" element={<SentGiftCards />} />
          <Route path="/gift-cards/received" element={<ReceivedGiftCards />} />
          <Route path="/gift-cards/redeem/:id" element={<RedeemGiftCard />} />

          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />

          <Route path="/brands/:id" element={<BrandDetails />} />

          <Route path="/occasions/:id" element={<OccasionDetails />} />

          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
