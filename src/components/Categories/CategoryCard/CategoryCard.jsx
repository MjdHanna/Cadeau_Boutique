import React from "react";
import { useTranslation } from "react-i18next";
import placeholderImg from "../../../assets/images/Banner/p1.png";

const CategoryCard = ({ category, compact = false }) => {
  const { t, i18n } = useTranslation();

  const categoryName =
    i18n.language === "ar"
      ? category.categoryNameArabic
      : category.categoryNameEnglish;

  const categoryDescription =
    i18n.language === "ar"
      ? category.categoryDescriptionArabic
      : category.categoryDescriptionEnglish;

  return (
    <div
      className={`flex flex-col items-center text-center ${
        compact ? "py-6 px-4" : "py-8 px-6"
      }`}
    >
      <div
        className={`${
          compact ? "w-20 h-20" : "w-full h-40"
        } mb-4 rounded-xl overflow-hidden flex items-center justify-center`}
      >
        <img
          src={category.categoryImage || placeholderImg}
          alt={categoryName || t("no Image")}
          className="object-contain w-full h-full"
          loading="lazy"
        />
      </div>
      <h3
        title={categoryName}
        className="font-semibold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full"
      >
        {categoryName}
      </h3>

      {!compact && categoryDescription && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {categoryDescription}
        </p>
      )}
    </div>
  );
};

export default CategoryCard;
