import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useGetBrandsQuery } from "../../redux/features/apiSlice";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { IconButton } from "@mui/material";

import Loader from "../Loader/Loader";

const BrandCard = lazy(() => import("../../components/brands/BrandCard"));

const ITEMS_PER_PAGE = 8;

const Brands = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isRTL = i18n.language === "ar";

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetBrandsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const brands = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((brand) => ({
      ...brand,
      brandName: isRTL ? brand.brandNameArabic : brand.brandNameEnglish,
      brandDescription: isRTL
        ? brand.brandDescriptionArabic
        : brand.brandDescriptionEnglish,
    }));
  }, [data, isRTL]);

  const totalPages = useMemo(
    () => Math.ceil(brands.length / ITEMS_PER_PAGE),
    [brands.length],
  );

  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return brands.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [brands, currentPage]);

  const handleBrandClick = useCallback(
    (brandId) => {
      navigate(`/brands/${brandId}`);
    },
    [navigate],
  );

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <p className="text-red-500 text-lg font-medium">
          {t("Failed to load brands")}
        </p>
      </div>
    );
  }

  if (!brands.length) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <p className="text-gray-500 text-lg">{t("No items found")}</p>
      </div>
    );
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-12
        md:py-16
      "
    >
      <div className="mb-10 md:mb-14">
        <h1
          className={`
            text-3xl
            md:text-4xl
            font-extrabold
            tracking-tight
            text-gray-900
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {t("Brands")}
        </h1>

        <div
          className="
            mt-3
            h-1
            w-24
            rounded-full
            bg-gradient-to-r from-primary to-primary/30"
        />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        }
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-6
            md:gap-8
          "
        >
          {paginatedBrands.map((brand) => (
            <BrandCard
              key={brand.brandId}
              brand={brand}
              onClick={() => handleBrandClick(brand.brandId)}
            />
          ))}
        </div>
      </Suspense>
      {totalPages > 1 && (
        <div
          className="
            mt-14
            flex
            justify-center
            items-center
            gap-5
          "
        >
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              transition: "0.3s",

              "&:hover": {
                backgroundColor: "#e5e7eb",
                transform: "scale(1.05)",
              },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <div
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-sm
              text-sm
              md:text-base
              font-semibold
             
            "
          >
            {t("Page")} {currentPage} {t("of")} {totalPages}
          </div>

          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              transition: "0.3s",

              "&:hover": {
                backgroundColor: "#e5e7eb",
                transform: "scale(1.05)",
              },
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
