// src/components/Slider/CategoryCard.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import p from "../../../assets/images/Banner/p1.png";

const CategoryCard = ({ category, compact = false }) => {
  const { t } = useTranslation();
  const placeholder = p;

  return (
    <div
      className={`flex ${
        compact ? "flex-col items-center py-4" : "flex-col"
      } px-4`}
    >
      <div
        className={`${
          compact ? "w-20 h-20 mb-3" : "w-full h-40 mb-4"
        } mx-auto overflow-hidden rounded-xl flex items-center justify-center`}
      >
        <img
          src={category.categoryImage || placeholder}
          alt={category.categoryName || t("categories.noImage")}
          className="object-contain w-full h-full"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="px-2 text-center">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          {category.categoryName}
        </h3>

        {!compact && category.categoryDescription && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
            {category.categoryDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
