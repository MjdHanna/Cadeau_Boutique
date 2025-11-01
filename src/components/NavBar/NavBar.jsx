import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiShoppingCart, HiUser } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleLanguage,
  selectTranslate,
} from "../../redux/features/translateSlice";
import UAE from "../../assets/images/NavBar/UAE.jpg";
import UK from "../../assets/images/NavBar/UK.jpg";
import logo from "../../assets/images/authentication/p1.png";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const lang = useSelector(selectTranslate);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, i18n]);

  return (
    <nav className="fixed top-0 w-full left-0 right-0 z-50 shadow-md bg-white text-gray-800 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center gap-4 py-4 w-full">
          <Link to="/">
            <motion.img
              whileHover={{ scale: 1.1 }}
              className="w-auto h-15"
              src={logo}
              alt="logo"
            />
          </Link>
          <div className="hidden md:flex flex-1 items-center justify-between">
            <div className="flex space-x-6 ml-4">
              {["Home", "Wishlist", "Trackorder", "About", "Contact"].map(
                (link) => (
                  <Link
                    key={link}
                    to={`/${link === "Home" ? "" : link.toLowerCase()}`}
                    className="font-medium transition hover:text-primary"
                  >
                    {t(link)}
                  </Link>
                )
              )}
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
                className="relative transition hover:text-blue-600"
              >
                <HiShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"></span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white shadow-lg hover:scale-105 transform transition-all duration-300"
                  >
                    <HiUser size={24} />
                  </Link>
                  <button
                    onClick={() => {
                      navigate("/");
                      dispatch(logoutAction());
                      dispatch(clearCart());
                    }}
                    className="px-5 py-2 rounded-lg text-sm bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300"
                  >
                    {t("Logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg text-sm bg-secondary text-white shadow-lg transition-all duration-300"
                  >
                    {t("Login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg text-sm bg-primary text-white shadow-lg transition-all duration-300"
                  >
                    {t("Sign Up")}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
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
              className="relative transition hover:text-blue-600"
            >
              <HiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"></span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-blue-600 transition"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden shadow-md transition-all duration-300 bg-white text-gray-800">
          <div className="flex flex-col px-4 py-4 space-y-2">
            <Link onClick={() => setIsOpen(false)} to="/">
              {t("Home")}
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/products">
              {t("Products")}
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/about">
              {t("About")}
            </Link>
            <Link onClick={() => setIsOpen(false)} to="/contact">
              {t("Contact")}
            </Link>

            {user ? (
              <>
                <Link onClick={() => setIsOpen(false)} to="/profile">
                  {t("Profile")}
                </Link>
                <button
                  onClick={() => {
                    navigate("/");
                    dispatch(logoutAction());
                    dispatch(clearCart());
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 mt-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  {t("Logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={() => setIsOpen(false)}
                  className="w-full px-3 py-2 rounded-md bg-secondary text-white text-center"
                  to="/login"
                >
                  {t("Login")}
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  className="w-full px-3 py-2 rounded-md bg-primary text-white text-center"
                  to="/register"
                >
                  {t("Sign Up")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
