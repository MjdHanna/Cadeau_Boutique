import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { onMessage, getToken } from "firebase/messaging";
import { messaging } from "./config/firebase";

import Loader from "./views/Loader/Loader";
import Navbar from "./Sharid/NavBar/NavBar";
import Footer from "./Sharid/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import AdDetails from "./components/AdDetails/AdDetails";

import {
  useSaveFcmTokenMutation,
  useGetUserQuery,
} from "./redux/features/apiSlice";
import {
  setCredentials,
  setUser,
  selectToken,
} from "./redux/features/authSlice";
import { selectTranslate } from "./redux/features/translateSlice";

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

function App() {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const token = useSelector(selectToken);
  const language = useSelector(selectTranslate);
  const { t, i18n } = useTranslation();

  const { data: userResponse, isSuccess } = useGetUserQuery(undefined, {
    skip: !token,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [saveFcmToken] = useSaveFcmTokenMutation();
  const [showSplash, setShowSplash] = useState(true);

  // دالة مساعدة لتوليد وإرسال الـ FCM Token
  const setupFCM = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          console.log("FCM Device Token Ready:", fcmToken);
          await saveFcmToken(fcmToken).unwrap();
          console.log("FCM Token saved successfully in backend!");
        }
      }
    } catch (error) {
      console.error("FCM Setup Error:", error);
    }
  };

  // 1. معالجة التوكن القادم من Google Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      dispatch(setCredentials({ token: urlToken }));
      window.history.replaceState(null, "", window.location.pathname);
      setupFCM();
      navigate("/");
    }
  }, [dispatch, navigate]);

  // تحديث بيانات المستخدم
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

  // ضبط اللغة واتجاه الصفحة
  useEffect(() => {
    const currentLang = language || i18n.language || "en";
    i18n.changeLanguage(currentLang);
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  }, [language, i18n]);

  // التحكم في الـ Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 2. الاستماع للإشعارات في الـ Foreground والتحقق من التوكن
  useEffect(() => {
    let unsubscribe = null;

    if (token) {
      setupFCM();

      unsubscribe = onMessage(messaging, (payload) => {
        const activeLang = language || i18n.language || "en";

        toast.custom(
          (tToast) => (
            <div
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              className={`${
                tToast.visible
                  ? "animate-enter opacity-100 scale-100"
                  : "animate-leave opacity-0 scale-95"
              } max-w-md w-full backdrop-blur-md bg-white/95 dark:bg-[#1f1a24]/95 border border-[#7e2553]/20 shadow-[0_20px_40px_-15px_rgba(126,37,83,0.2)] rounded-2xl pointer-events-auto p-4 transition-all duration-300 ease-out`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-[#7e2553] to-[#a3326d] flex items-center justify-center shadow-md shadow-[#7e2553]/25">
                  <svg
                    className="w-5 h-5 text-white animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {payload.notification?.title || t("New Notification")}
                    </h4>
                    <span className="text-[11px] font-medium text-[#7e2553] dark:text-[#d67ba8] bg-[#7e2553]/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {t("Just now")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {payload.notification?.body}
                  </p>
                </div>

                <button
                  onClick={() => toast.dismiss(tToast.id)}
                  aria-label={t("Close")}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full p-1.5 transition-colors focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-3.5 w-full bg-gray-100 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#7e2553] to-[#c99700] h-full rounded-full w-full animate-[shrink_5s_linear]" />
              </div>
            </div>
          ),
          { duration: 5000 },
        );
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [token, language, i18n.language, t]);
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
