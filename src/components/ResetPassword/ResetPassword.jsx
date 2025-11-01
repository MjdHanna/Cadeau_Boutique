import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const [data, setData] = useState({ password: "", confirmPassword: "" });
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2
          className={`text-2xl font-bold text-gray-800 mb-1 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("Set New Password")}
        </h2>
        <p
          className={`text-gray-500 mb-6 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("Please enter your new password")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={data.password}
              onChange={handleChange}
              placeholder="*****"
              className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label
              className={`block text-gray-700 mb-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("Confirm Password")}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="*****"
              className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold p-3 rounded-lg transition"
          >
            {t("Set New Password")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
