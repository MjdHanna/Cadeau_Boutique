import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import p1 from "../../assets/images/Brands/aa5adf76fc3870ad0bea8e16efe4a6b3b3079c98.png";
import p2 from "../../assets/images/Brands/e477018677b17bf6a41716af1d98dcf532a6c4da.png";
import p3 from "../../assets/images/Brands/image 24.png";

// Fake data
const products = [
  { id: 1, img: p1 },
  { id: 2, img: p2 },
  { id: 3, img: p3 },
];

const Brands = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl font-bold mb-10 text-gray-800 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {t("title")}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.07, rotate: 1 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
          >
            <img src={product.img} className="w-full h-52 object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
