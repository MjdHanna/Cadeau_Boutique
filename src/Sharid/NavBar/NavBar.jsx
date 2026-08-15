import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiMenu,
  HiX,
  HiShoppingCart,
  HiUser,
  HiUsers,
  HiOutlineBell,
  HiCheckCircle,
  HiOutlineHeart,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleLanguage,
  selectTranslate,
} from "../../redux/features/translateSlice";
import {
  logout as logoutAction,
  selectToken,
} from "../../redux/features/authSlice";
import {
  useGetWishlistQuery,
  useLogoutMutation,
} from "../../redux/features/apiSlice";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { useGetCartQuery } from "../../redux/features/apiSlice";
import { useLocation } from "react-router-dom";
import UAE from "../../assets/images/NavBar/UAE.png";
import UK from "../../assets/images/NavBar/UK.png";
import logo from "../../assets/images/NavBar/a_logo_for_a_gift_app_named_bella_regalo_keep_the_exact_icon_from.png";
import { toast } from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const lang = useSelector(selectTranslate);
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const isAuthenticated = Boolean(token);
  // const [showNotifications, setShowNotifications] = useState(false);
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !token,
  });

  const cartCount = Array.isArray(cartData?.data?.cartItems)
    ? cartData.data.cartItems.length
    : 0;

  const [logoutApi, { isLoading }] = useLogoutMutation();

  const { data: wishlistData } = useGetWishlistQuery(
    token ? undefined : skipToken,
  );

  const loading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dataa = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Search With Items",
      path: "/search",
    },
    {
      label: "Friends",
      path: "/friends",
      icon: HiUsers,
    },
    {
      label: "Wishlist",
      path: "/wishlist",
    },
    {
      label: "Trackorder",
      path: "/orders",
    },
    {
      label: "About",
      path: "/about",
    },
    {
      label: "Contact",
      path: "/contact",
    },
  ];
  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, i18n]);
  const notificationsCount = 5;
  const handleLogout = async () => {
    try {
      if (token) {
        await logoutApi().unwrap();
      }

      dispatch(logoutAction());
      toast.success(t("Logout successful!"));
      navigate("/");
    } catch (error) {
      dispatch(logoutAction());
      toast.error(error?.data?.message || t("Logout failed"));
    }
  };
  const profileImg = user?.profile_img || user?.profileImg;
  const getImageUrl = (img) => {
    if (!img) return null;

    if (img.startsWith("http")) return img;

    return `https://cdb-back.bw-businessworld.net/${img}`;
  };
  return (
    <nav className="fixed top-0 w-full left-0 right-0 z-50 shadow-md bg-white text-gray-800 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center gap-4 py-4 w-full">
          <Link to="/" className="inline-block">
            <img
              className="w-auto h-12 transition-transform duration-300 hover:scale-110"
              src={logo}
              alt="logo"
            />
          </Link>
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="flex space-x-6 ml-4">
              {dataa.map(({ label, path, icon: Icon }) => (
                <Link
                  key={label}
                  to={path}
                  className={`relative font-medium transition hover:text-primary
        ${location.pathname === path ? "text-primary" : "text-gray-700"}
      `}
                >
                  {t(label)}

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300
          ${location.pathname === path ? "w-full" : "w-0"}
        `}
                  />
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(toggleLanguage())}
                className="w-9 h-9 rounded-full overflow-hidden shadow-md hover:scale-110 transition-transform border border-gray-300 bg-gray-100"
              >
                <img
                  src={lang === "en" ? UAE : UK}
                  alt={lang === "en" ? "Arabic Flag" : "English Flag"}
                  className="w-full h-full object-cover"
                />
              </button>
              <Link
                to="/cart"
                className="relative transition hover:text-primary"
              >
                <HiShoppingCart size={24} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/notifications" className="relative group">
                <div
                  className="
      w-11 h-11
      rounded-2xl
      bg-gradient-to-br from-primary/10 to-secondary/10
      border border-primary/20
      flex items-center justify-center
      transition-all duration-300
      hover:scale-110
      hover:shadow-lg
      hover:border-primary
    "
                >
                  <HiOutlineBell
                    size={22}
                    className="text-primary group-hover:animate-pulse"
                  />
                </div>

                {notificationsCount > 0 && (
                  <span
                    className="
        absolute
        -top-1
        -right-1
        min-w-[20px]
        h-5
        px-1
        rounded-full
        bg-red-500
        text-white
        text-[11px]
        font-bold
        flex items-center justify-center
        animate-bounce
      "
                  >
                    {notificationsCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center justify-center"
                  >
                    <img
                      src={
                        profileImg
                          ? `${getImageUrl(profileImg)}?t=${Date.now()}`
                          : `https://ui-avatars.com/api/?name=${user?.name || "User"}`
                      }
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || "User"}`;
                      }}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 shadow-md"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className={`px-5 py-2 rounded-lg text-sm text-white shadow-lg transition flex items-center gap-2
    ${
      isLoading
        ? "bg-red-400 cursor-not-allowed"
        : "bg-red-500 hover:bg-red-600"
    }
  `}
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("Logging out...")}
                      </>
                    ) : (
                      t("Logout")
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg text-sm bg-third text-white shadow-lg transition"
                  >
                    {t("Login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg text-sm bg-primary text-white shadow-lg transition"
                  >
                    {t("Sign Up")}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* --- Mobile --- */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleLanguage())}
              className="w-9 h-9 rounded-full overflow-hidden shadow-md hover:scale-110 transition border border-gray-300 bg-gray-100"
            >
              <img
                src={lang === "en" ? UAE : UK}
                alt="flag"
                className="w-full h-full object-cover"
              />
            </button>

            <Link
              to="/cart"
              className="relative transition hover:text-blue-600"
            >
              <HiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/notifications" className="relative">
              <HiOutlineBell size={24} className="text-primary" />

              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {notificationsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-blue-600 transition"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
            {/* الاشعارات ؟؟؟؟؟؟؟؟؟؟؟؟؟؟ */}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white rounded-t-3xl shadow-2xl p-8 mx-4 sm:mx-10 md:hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
            >
              <HiX size={30} />
            </button>

            <img
              src={logo}
              alt="Logo"
              className="w-20 h-20 mb-4 object-contain opacity-90"
            />

            <div className="flex flex-col items-center space-y-4 w-full text-center">
              {dataa.map(({ label, path }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-gray-700  hover:text-primary transition"
                >
                  <div className="flex items-center gap-3">
                    <span>{t(label)}</span>
                  </div>
                </Link>
              ))}

              <div className="border-t border-gray-300  w-full my-4" />

              {isAuthenticated ? (
                <>
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/profile"
                    className="text-lg font-medium text-gray-700  hover:text-primary transition"
                  >
                    {t("Profile")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg text-sm text-white shadow-lg transition flex items-center justify-center gap-2
    ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
  `}
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("Logging out...")}
                      </>
                    ) : (
                      t("Logout")
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 rounded-lg bg-third text-white font-medium text-center hover:bg-secondary/90 transition"
                    to="/login"
                  >
                    {t("Login")}
                  </Link>
                  <Link
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 rounded-lg bg-primary text-white font-medium text-center hover:bg-primary/90 transition"
                    to="/register"
                  >
                    {t("Sign Up")}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
