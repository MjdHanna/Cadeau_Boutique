import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import WishlistButton from "../../components/WishlistButton/WishlistButton";

const ItemCard = ({
  image,
  title,
  description,
  price,
  onClick,
  hoverScale = 1.05,
  product,
  wishlistItems = [],
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      onClick={onClick}
      className="
        relative
        bg-white rounded-xl shadow-md hover:shadow-xl
        transition p-5 flex flex-col cursor-pointer
      "
    >
      {product && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <WishlistButton product={product} wishlistItems={wishlistItems} />
        </div>
      )}
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden mb-3">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">{t("No image")}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      <p className="text-gray-500 text-sm mt-1 text-center line-clamp-2">
        {description || t("No description")}
      </p>
      {price !== undefined && (
        <p className="mt-2 font-bold text-primary text-center">
          {t("Price")}: ${price}
        </p>
      )}
    </motion.div>
  );
};

export default memo(ItemCard);
