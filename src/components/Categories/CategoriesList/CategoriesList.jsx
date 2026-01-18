// src/pages/CategoriesList.jsx
import React from "react";
import { useGetCategoriesQuery } from "../../../redux/features/apiSlice";
import CategoryCard from "../../../components/Categories/CategoryCard/CategoryCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CategoriesList = () => {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        {t("Failed to load categories")}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-8 text-gray-800
        ${isRTL ? "text-right" : "text-left"}
        flex sm:block justify-center sm:justify-start`}
      >
        {t("categories.title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.categoryId}
            onClick={() => navigate(`/categories/${cat.categoryId}`)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-transform duration-200 hover:scale-[1.02]"
            role="button"
            tabIndex={0}
          >
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
