import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import p1 from "../../assets/images/authentication/p1.png";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
  });

  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div
      className="min-h-screen flex items-center justify-center mt-10 px-4 py-8"
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
              {t("Sign Up")}
            </h2>
            <h3
              className={`${isRTL ? "text-right" : "text-left"} text-primary`}
            >
              {t("Welcome back to our store")}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-4">
            <div>
              <label
                className={`block text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("Full Name")}
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t("Enter full name")}
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                className={`block text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("Email Address")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                className={`block text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("Gender")}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t("Select gender")}</option>
                <option value="male">{t("Male")}</option>
                <option value="female">{t("Female")}</option>
              </select>
            </div>

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

            <button
              type="submit"
              className="w-full p-3 bg-primary text-white font-bold rounded-lg hover:bg-primary transition"
            >
              {t("Sign Up")}
            </button>

            <p className={`text-gray-600 text-center`}>
              {t("Already have an account?")}{" "}
              <a href="/login" className="text-primary font-semibold">
                {t("Click here to login")}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
