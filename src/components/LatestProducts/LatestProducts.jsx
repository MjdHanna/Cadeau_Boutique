import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import banner2 from "../../assets/images/Banner/p1.png";
import banner3 from "../../assets/images/Banner/p2.png";
import banner1 from "../../assets/images/Banner/p3.png";
// Fake data
const products = [
  {
    id: 1,
    name: "باقة ورد فاخرة",
    price: "$40",
    img: banner2,
  },
  {
    id: 2,
    name: "علبة شوكولا فاخرة",
    price: "$32",
    img: banner3,
  },
  {
    id: 3,
    name: "هدايا فاخرة ",
    price: "$55",
    img: banner1,
  },
];

const LatestProducts = () => {
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
        {t("Latest")}
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
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {product.name}
              </h3>
              <motion.span
                className="font-bold text-primary text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.4 }}
              >
                {product.price}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
