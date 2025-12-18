// src/pages/CategoryDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../../redux/features/apiSlice";
import CategoryCard from "../../../components/Categories/CategoryCard/CategoryCard";
import { useTranslation } from "react-i18next";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data, isLoading, error } = useGetCategoryByIdQuery(id);
  const payload = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mt-3" />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="text-center py-20 text-red-500">
        {t("categories.detailsError")}
      </div>
    );
  }

  const { category, subcategories, products } = payload;

  return (
    <div className="max-w-7xl mx-auto px-4 py-25" dir={isRTL ? "rtl" : "ltr"}>
      {/* Category header */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold">{category.categoryName}</h1>
        {category.categoryDescription && (
          <p className="text-gray-600 mt-2">{category.categoryDescription}</p>
        )}
      </div>

      {/* Subcategories */}
      {subcategories?.length > 0 && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            {category.subcategories}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {subcategories.map((sub) => (
              <div
                key={sub.categoryId}
                onClick={() => navigate(`/categories/${sub.categoryId}`)}
                className="bg-white rounded-2xl p-4 shadow hover:shadow-2xl cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
              >
                <CategoryCard category={sub} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{category.products}</h3>

        {products?.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
            {category.noProducts}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.productId}
                className="bg-white rounded-2xl p-3 shadow hover:shadow-2xl"
              >
                <h4 className="font-semibold">{p.name}</h4>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default CategoryDetails;
