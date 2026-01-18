import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetBrandByIdQuery,
  useGetWishlistQuery,
} from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";
import { useNavigate } from "react-router-dom";
const BrandDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetBrandByIdQuery(id);

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const wishlistItems = wishlistData?.data?.wishlistItems || [];

  /* ================= Brand ================= */
  const brand = useMemo(() => {
    if (!data?.data?.brand) return null;

    const b = data.data.brand;

    return {
      ...b,
      brandName:
        i18n.language === "ar" ? b.brandNameArabic : b.brandNameEnglish,
      brandDescription:
        i18n.language === "ar"
          ? b.brandDescriptionArabic
          : b.brandDescriptionEnglish,
    };
  }, [data, i18n.language]);

  /* ================= Products ================= */
  const products = useMemo(() => {
    if (!data?.data?.products) return [];
    return data.data.products.map((p) => ({
      ...p,
      productName:
        i18n.language === "ar" ? p.productNameArabic : p.productNameEnglish,
      productDescription:
        i18n.language === "ar"
          ? p.productDescriptionArabic
          : p.productDescriptionEnglish,
    }));
  }, [data, i18n.language]);

  /* ================= States ================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="loader border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        {t("Failed to load brand data")}
      </p>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Brand Info */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">{brand?.brandName}</h2>
        <p className="text-gray-600 mt-3 text-lg">{brand?.brandDescription}</p>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">{t("No products found")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ItemCard
              key={product.productId}
              image={null}
              title={product.productName}
              description={product.productDescription}
              price={product.productPrice}
              product={product}
              wishlistItems={wishlistItems}
              onClick={() => navigate(`/products/${product.productId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
