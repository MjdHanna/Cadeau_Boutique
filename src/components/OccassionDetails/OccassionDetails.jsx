// src/pages/OccasionDetails.jsx
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetOccasionsByIdQuery,
  useGetWishlistQuery,
} from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";

const OccasionDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);

  const { data, isLoading, error } = useGetOccasionsByIdQuery(id);

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const wishlistItems = wishlistData?.data?.wishlistItems || [];
  const payload = data?.data;

  /* ================= Occasion ================= */
  const occasion = useMemo(() => {
    if (!payload?.occasion) return null;
    const o = payload.occasion;

    return {
      ...o,
      name:
        i18n.language === "ar" ? o.occasionNameArabic : o.occasionNameEnglish,
      description:
        i18n.language === "ar"
          ? o.occasionDescriptionArabic
          : o.occasionDescriptionEnglish,
    };
  }, [payload, i18n.language]);

  /* ================= Products ================= */
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

  /* ================= States ================= */
  if (isLoading) {
    return <p className="text-center py-20">{t("Loading...")}</p>;
  }

  if (error || !occasion) {
    return (
      <p className="text-center py-20 text-red-500">
        {t("Failed to load occasion")}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28" dir={isRTL ? "rtl" : "ltr"}>
      {/* ===== Occasion Header ===== */}
      <div className="bg-white rounded-2xl p-6 shadow mb-10">
        <h1 className="text-3xl font-bold">{occasion.name}</h1>
        {occasion.description && (
          <p className="text-gray-600 mt-2">{occasion.description}</p>
        )}
      </div>

      {/* ===== Products ===== */}
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
              wishlistItems={wishlistItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OccasionDetails;
