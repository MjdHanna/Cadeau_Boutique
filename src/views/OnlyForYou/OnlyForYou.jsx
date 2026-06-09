import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useOnlyForYouQuery } from "../../redux/features/apiSlice";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
const OnlyForYou = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const token = useSelector(selectToken);

  const { data, isLoading, error } = useOnlyForYouQuery(undefined, {
    skip: !token,
  });

  if (!token) {
    return null;
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 text-red-500 px-6 py-4 rounded-2xl shadow-sm">
          {t("Error happened while loading recommendations.")}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-10">{t("Only For You")}</h1>

        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
          {t(
            "Personalized recommendations specially selected for your interests.",
          )}
        </p>
      </div>

      {!data?.data?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt="empty"
            className="w-40 opacity-70"
          />

          <h2 className="text-2xl font-bold mt-6 text-gray-700">
            {t("No recommendations yet")}
          </h2>

          <p className="text-gray-500 mt-2">
            {t(
              "Try interacting with products to get personalized suggestions.",
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.data?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-72 object-cover hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {t("Recommended")}
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                  {i18n.language === "ar" ? item.nameAr : item.nameEn}
                </h2>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-xl font-extrabold text-primary">
                    ${item.price}
                  </span>

                  <button
                    onClick={() => navigate(`/products/${item.productId}`)}
                    className="bg-primary text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                  >
                    {t("View")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlyForYou;
