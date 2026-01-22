import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetLatestProductsQuery,
  useGetWishlistQuery,
} from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";

const LatestProducts = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);

  // ===== Fetch latest products =====
  const { data, isLoading, error } = useGetLatestProductsQuery();

  // ===== Fetch wishlist if user logged in =====
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });
  const wishlistItems = wishlistData?.data?.wishlistItems || [];

  // ===== Normalize products =====
  const products = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((p) => ({
      ...p,
      productName: isRTL ? p.productNameArabic : p.productNameEnglish,
      productDescription: isRTL
        ? p.productDescriptionArabic
        : p.productDescriptionEnglish,
    }));
  }, [data, isRTL]);

  if (isLoading) {
    return <p className="text-center py-20">{t("Loading...")}</p>;
  }

  if (error) {
    return (
      <p className="text-center py-20 text-red-500">
        {t("Failed to load latest products")}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-28" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold mb-10">{t("Latest Products")}</h1>

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

export default LatestProducts;
