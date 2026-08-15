import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loader from "./views/Loader/Loader";
import Navbar from "./Sharid/NavBar/NavBar";
import Footer from "./Sharid/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import { Toaster } from "react-hot-toast";
import { useGetUserQuery } from "./redux/features/apiSlice";
import {
  setCredentials,
  setUser,
  selectToken,
} from "./redux/features/authSlice";
import { selectTranslate } from "./redux/features/translateSlice";
import i18n from "./i18n";
import { getToken } from "firebase/messaging";
import { messaging } from "./config/firebase";
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
import SplashScreen from "./components/SplashScreen/SplashScreen";
import AdDetails from "./components/AdDetails/AdDetails";
function App() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const token = useSelector(selectToken);
  const { data: userResponse, isSuccess } = useGetUserQuery(undefined, {
    skip: !token,
  });
  const language = useSelector(selectTranslate);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      dispatch(setCredentials({ token: urlToken }));
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/");
    }
  }, [dispatch, navigate]);

  
  useEffect(() => {
    if (isSuccess && userResponse) {
      const userData = userResponse?.data || userResponse;
      const formattedUser = {
        id: userData.userId || userData.id,
        name: userData.userName || userData.name,
        role: userData.userAbility || userData.role,
        vendorId: userData.vendorId,
      };

      dispatch(setUser(formattedUser)); 
    }
  }, [isSuccess, userResponse, dispatch]);

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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  // ========================================================
  // --- إضافة كود إشعارات Firebase هنا ---
  // ========================================================
  useEffect(() => {
    async function requestNotificationPermission() {
      // نطلب الصلاحية فقط إذا كان المستخدم مسجلاً للدخول (يوجد توكن المصادقة)
      if (token) {
        try {
          const permission = await Notification.requestPermission();

          if (permission === "granted") {
            const fcmToken = await getToken(messaging, {
              vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // استبدل هذا بالمفتاح الخاص بك من لوحة تحكم فايربيز
            });

            console.log("FCM Device Token:", fcmToken);

            // إرسال الـ FCM Token إلى الخادم (Laravel) لحفظه للمستخدم الحالي
            await fetch("https://your-laravel-api.com/api/save-fcm-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // نرسل توكن المستخدم لكي يعرف Laravel لمن هذا الـ FCM Token
              },
              body: JSON.stringify({ fcm_token: fcmToken }),
            });
          } else {
            console.log("المستخدم رفض استقبال الإشعارات");
          }
        } catch (error) {
          console.error("حدث خطأ أثناء طلب صلاحية الإشعارات:", error);
        }
      }
    }

    requestNotificationPermission();
  }, [token]); // ربطنا هذا الـ useEffect بـ token لكي يعمل فور تسجيل الدخول
  // ========================================================
  return (
    <div>
      {isLoading && <Loader />}

      <Toaster />
      <SplashScreen isVisible={showSplash} />
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
          <Route path="/adds/:id" element={<AdDetails />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}

export default App;
