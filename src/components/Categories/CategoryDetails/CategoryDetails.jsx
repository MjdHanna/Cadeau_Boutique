import { useParams, useNavigate } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../../redux/features/apiSlice";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import CategoryCard from "../../../components/Categories/CategoryCard/CategoryCard";
import ItemCard from "../../../components/brands/ItemCard";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data, isLoading, error } = useGetCategoryByIdQuery(id);
  const payload = data?.data;
  const category = useMemo(() => {
    if (!payload?.category) return null;
    const c = payload.category;
    return {
      ...c,
      name:
        i18n.language === "ar" ? c.categoryNameArabic : c.categoryNameEnglish,
      description:
        i18n.language === "ar"
          ? c.categoryDescriptionArabic
          : c.categoryDescriptionEnglish,
    };
  }, [payload, i18n.language]);
  const products = useMemo(() => {
    if (!payload?.products) return [];
    return payload.products.map((p) => ({
      ...p,
      productName:
        i18n.language === "ar" ? p.productNameArabic : p.productNameEnglish,
      productDescription:
        i18n.language === "ar"
          ? p.productDescriptionArabic
          : p.productDescriptionEnglish,
    }));
  }, [payload, i18n.language]);

  const subcategories = payload?.subcategories || [];
  if (isLoading) {
    return <p className="text-center py-20">{t("Loading...")}</p>;
  }

  if (error || !category) {
    return (
      <p className="text-center py-20 text-red-500">
        {t("Failed to load category")}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white rounded-2xl p-6 shadow mb-10">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>
      {subcategories.length > 0 && (
        <>
          {/* <h3 className="text-xl font-semibold mb-6">{t("Subcategories")}</h3> */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {subcategories.map((sub) => (
              <div
                key={sub.categoryId}
                onClick={() => navigate(`/categories/${sub.categoryId}`)}
                className="cursor-pointer"
              >
                <CategoryCard category={sub} />
              </div>
            ))}
          </div>
        </>
      )}
      {subcategories.length === 0 && (
        <>
          <h3 className="text-xl font-semibold mb-6">{t("Products")}</h3>

          {products.length === 0 ? (
            <p className="text-gray-500">{t("No products found")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ItemCard
                  key={p.productId}
                  title={p.productName}
                  description={p.productDescription}
                  price={p.productPrice}
                  product={p}
                  onClick={() => navigate(`/products/${p.productId}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetails;
