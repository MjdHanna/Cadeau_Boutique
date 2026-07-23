import { memo } from "react";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { motion } from "framer-motion";

const FollowedBrandCard = ({ brand }) => {
  const lang = useSelector(selectTranslate);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="
      group
      rounded-2xl
      bg-white
      border
      border-gray-200
      shadow-sm
      hover:shadow-xl
      overflow-hidden
      transition-all
    "
    >
      <div className="p-6 flex gap-5 items-center">
        <img
          src={brand.logo}
          alt={lang === "ar" ? brand.nameAr : brand.nameEn}
          loading="lazy"
          decoding="async"
          className="
          w-20
          h-20
          rounded-2xl
          object-cover
          border
          bg-gray-100
        "
        />

        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">
            {lang === "ar" ? brand.nameAr : brand.nameEn}
          </h3>

          <p className="text-sm mt-2 text-gray-500 line-clamp-2">
            {lang === "ar" ? brand.descriptionAr : brand.descriptionEn}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(FollowedBrandCard);
