import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";

import p1 from "../../assets/images/authentication/p1.png";
import FcGoogle from "../../assets/images/authentication/Google__G__logo.svg.png";
import FaFacebookF from "../../assets/images/authentication/png-transparent-fb-facebook-facebook-logo-social-media-icon-removebg-preview.png";

const Login = () => {
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => e.preventDefault();

  const isRTL = lang === "ar";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8">
        <div
          className={`flex flex-col md:flex-row items-start gap-10 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="flex flex-col items-start space-y-3 w-full md:w-1/2">
            <img src={p1} alt="Logo" className="h-16 object-contain" />
            <h2
              className={`text-3xl font-bold text-gray-900 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("Login")}
            </h2>
            <p
              className={`text-primary text-sm ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("Login to access your account")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4">
            <div>
              <label
                className={`block text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("Phone Number")}
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+963"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                className={`block text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("Password")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className={`${isRTL ? "text-left" : "text-right"} -mt-2`}>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                {t("Forgot Password?")}
              </a>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-primary text-white font-bold rounded-lg hover:bg-primary transition"
            >
              {t("Login")}
            </button>

            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition">
                <img src={FcGoogle} alt="Google Logo" className="w-5 h-5" />
                {t("Continue with Google")}
              </button>

              <button className="flex items-center justify-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition">
                <img
                  src={FaFacebookF}
                  alt="Facebook Logo"
                  className="w-5 h-5"
                />
                {t("Continue with Facebook")}
              </button>
            </div>

            <p className={`text-gray-600 text-center`}>
              {t("Don't have an account?")}{" "}
              <a href="/register" className="text-primary font-semibold">
                {t("Create one")}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
