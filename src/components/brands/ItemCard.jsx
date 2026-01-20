import { memo, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import WishlistButton from "../../components/WishlistButton/WishlistButton";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
const ItemCard = ({
  product,
  onClick,
  hoverScale = 1.05,
  wishlistItems = [],
}) => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [showFeatures, setShowFeatures] = useState(false);
  const normalizedProduct = useMemo(() => {
    if (!product) return null;

    return {
      id: product.productId,
      title: isRTL ? product.productNameArabic : product.productNameEnglish,
      description: isRTL
        ? product.productDescriptionArabic
        : product.productDescriptionEnglish,
      price: product.productPrice || product.productPriceFrom,
      image: product.productImage,
      features: isRTL
        ? product.productFeaturesArabic
        : product.productFeaturesEnglish,
    };
  }, [product, isRTL]);

  if (!normalizedProduct) return null;

  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col cursor-pointer"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="absolute top-3 right-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <WishlistButton
          product={{ ...product, id: product.productId }}
          wishlistItems={wishlistItems}
        />
      </div>

      {/* Image */}
      <div className="h-44 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-4">
        {normalizedProduct.image ? (
          <img
            src={normalizedProduct.image}
            alt={normalizedProduct.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-sm">{t("No image")}</span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-center line-clamp-1">
        {normalizedProduct.title}
      </h3>
      <p className="text-gray-500 text-sm text-center mt-1 line-clamp-2">
        {normalizedProduct.description}
      </p>
      <p className="mt-3 text-center font-semibold text-primary">
        {t("Price")}: ${normalizedProduct.price}
      </p>

      {normalizedProduct.features && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFeatures((prev) => !prev);
          }}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          {showFeatures ? t("Show less") : t("Show more")}
        </button>
      )}

      {/* Features */}
      <AnimatePresence>
        {showFeatures && normalizedProduct.features && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 text-sm text-gray-600 space-y-2"
          >
            {Object.entries(normalizedProduct.features).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between bg-gray-50 rounded-lg px-3 py-1"
              >
                <span className="font-medium">{key}</span>
                <span className="text-gray-700">{value}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <AddToCartButton
        productId={product.productId}
        variantId={product.variantId}
      />
    </motion.div>
  );
};

export default memo(ItemCard);
