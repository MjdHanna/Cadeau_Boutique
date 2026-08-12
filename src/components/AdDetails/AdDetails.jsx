import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetAdByIdQuery } from "../../redux/features/apiSlice";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { motion } from "framer-motion";

import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = useSelector(selectTranslate);

  const giftFriend = location.state?.giftFriend;

  const { data: response, isLoading, isError } = useGetAdByIdQuery(id);
  const adData = response?.data;

  const [selectedVariant, setSelectedVariant] = useState(null);

  const variants = useMemo(() => {
    return Array.isArray(adData?.productVariants) ? adData.productVariants : [];
  }, [adData]);

  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0].variantId || 0);
    }
  }, [variants, selectedVariant]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !adData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-bold mb-4">
          {lang === "ar"
            ? "عفواً، الإعلان غير متوفر"
            : "Sorry, Ad not available"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline"
        >
          {lang === "ar" ? "العودة للصفحة الرئيسية" : "Return to Home"}
        </button>
      </div>
    );
  }

  const addTitle = lang === "ar" ? adData.addTitleAr : adData.addTitleEn;
  const productName =
    lang === "ar" ? adData.productNameArabic : adData.productNameEnglish;
  const productDesc =
    lang === "ar"
      ? adData.productDescriptionArabic
      : adData.productDescriptionEnglish;
  const productFeatures =
    lang === "ar" ? adData.productFeaturesAr : adData.productFeaturesEn;
  const currentVariant =
    variants.find((v, index) => (v.variantId || index) === selectedVariant) ||
    variants[0];
  const displayPrice = currentVariant
    ? currentVariant.variantPrice
    : adData.productPrice;
  const displayNewPrice = currentVariant
    ? currentVariant.variantNewPrice
    : adData.productNewPrice;
  const displayDiscount = displayPrice - displayNewPrice;
  const discountPercentage = Math.round((displayDiscount / displayPrice) * 100);

  return (
    <div
      className="min-h-screen bg-gray-50 py-25 px-4 sm:px-6 lg:px-8"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 relative bg-gray-100 p-8 flex items-center justify-center">
          {discountPercentage > 0 && (
            <div
              className={`absolute top-6 ${lang === "ar" ? "right-6" : "left-6"} bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10`}
            >
              {lang === "ar"
                ? `خصم ${discountPercentage}%`
                : `${discountPercentage}% OFF`}
            </div>
          )}

          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={adData.productImage}
            alt={productName}
            className="w-full max-w-md h-auto object-contain drop-shadow-2xl rounded-2xl mix-blend-multiply"
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <span className="text-sm font-bold text-primary mb-3 uppercase tracking-widest">
            {addTitle}
          </span>

          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            {productName}
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {productDesc}
          </p>

          {productFeatures && Object.keys(productFeatures).length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(productFeatures).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 rounded-xl p-3 flex flex-col"
                  >
                    <span className="text-xs text-gray-500 font-medium mb-1">
                      {key}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                {lang === "ar" ? "الخيارات" : "Options"}
              </h3>
              <div className="flex gap-3 flex-wrap">
                {variants.map((v, index) => {
                  const variantId = v.variantId || index;
                  const attrs =
                    lang === "ar"
                      ? v.variantAttributesAr
                      : v.variantAttributesEn;
                  const isSelected = selectedVariant === variantId;
                  const inStock = v.variantStockQuantity > 0;

                  return (
                    <button
                      key={variantId}
                      disabled={!inStock}
                      onClick={() => setSelectedVariant(variantId)}
                      className={`
                        px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2
                        ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                        }
                        ${!inStock ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}
                      `}
                    >
                      {Object.values(attrs || {})
                        .map((val) =>
                          typeof val === "object" ? JSON.stringify(val) : val,
                        )
                        .join(" / ")}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-4xl lg:text-5xl font-black text-primary">
                ${displayNewPrice}
              </span>
              {displayDiscount > 0 && (
                <span className="text-xl text-gray-400 line-through font-medium">
                  ${displayPrice}
                </span>
              )}
            </div>
            {displayDiscount > 0 && (
              <p className="text-sm font-bold text-green-600 mt-2">
                {lang === "ar"
                  ? `لقد وفرت $${displayDiscount.toFixed(2)}`
                  : `You saved $${displayDiscount.toFixed(2)}`}
              </p>
            )}
          </div>

          <div className="mt-auto pt-4 w-full">
            <AddToCartButton
              productId={adData.productId}
              variantId={selectedVariant}
              onSuccess={() => {
                if (giftFriend) {
                  navigate("/cart", { state: { giftFriend } });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
