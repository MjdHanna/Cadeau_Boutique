import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGetBrandsQuery } from "../../redux/features/apiSlice";
import BrandCard from "../../components/brands/BrandCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
const ITEMS_PER_PAGE = 8;

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

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE);

  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return brands.slice(startIndex, endIndex);
  }, [brands, currentPage]);

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

  if (!brands.length) {
    return <p className="text-center my-20">{t("No items found")}</p>;
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 py-14"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-10 ${
          isRTL ? "text-right" : "text-left"
        } flex sm:block justify-center sm:justify-start`}
      >
        {t("Brands")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {paginatedBrands.map((brand) => (
          <BrandCard
            key={brand.brandId}
            brand={brand}
            onClick={() => navigate(`/brands/${brand.brandId}`)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <IconButton
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{
              backgroundColor: "#e5e7eb",
              "&:hover": { backgroundColor: "#d1d5db" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <span>
            {t("Page")} {currentPage} {t("of")} {totalPages}
          </span>

          <IconButton
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            sx={{
              backgroundColor: "#e5e7eb",
              "&:hover": { backgroundColor: "#d1d5db" },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </section>
  );
};

export default Brands;
