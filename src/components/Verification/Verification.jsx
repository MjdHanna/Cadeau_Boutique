import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";

const Verification = () => {
  const [code, setCode] = useState("");
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";

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
          {t("Verification")}
        </h2>
        <p
          className={`text-gray-500 mb-6 ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("Please enter verification code")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-gray-700 mb-1 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("Verification Code")}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="4 4 4 4 9"
              className="w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold p-3 rounded-lg transition"
          >
            {t("Verify Code")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
