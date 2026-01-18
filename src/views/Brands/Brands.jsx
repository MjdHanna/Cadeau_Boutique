// src/pages/Brands/Brands.jsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGetBrandsQuery } from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";
import BrandCard from "../../components/brands/BrandCard";

const Brands = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";

  const { data, isLoading, error } = useGetBrandsQuery();

  const brands = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((brand) => ({
      ...brand,
      brandName:
        i18n.language === "ar" ? brand.brandNameArabic : brand.brandNameEnglish,
      brandDescription:
        i18n.language === "ar"
          ? brand.brandDescriptionArabic
          : brand.brandDescriptionEnglish,
    }));
  }, [data, i18n.language]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <div className="loader border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center my-20 text-red-500">
        {t("Failed to load brands")}
      </p>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 py-14"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-10
        ${isRTL ? "text-right" : "text-left"}
        flex sm:block justify-center sm:justify-start`}
      >
        {t("Brands")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {brands.map((brand) => (
          <BrandCard
            key={brand.brandId}
            brand={brand}
            onClick={() => navigate(`/brands/${brand.brandId}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default Brands;
