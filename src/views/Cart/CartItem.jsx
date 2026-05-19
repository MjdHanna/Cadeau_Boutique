import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CartItem = ({ item }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <img
          src={item.image}
          alt=""
          className="w-full sm:w-32 h-32 object-cover rounded-3xl"
        />

        <div className="flex-1 flex justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{item.productName}</h2>

            <p className="text-gray-500 mt-2">{t("Premium Gift Product")}</p>

            <div className="mt-5 inline-flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-2xl">
              <button className="text-xl font-bold">-</button>

              <span>{item.quantity}</span>

              <button className="text-xl font-bold">+</button>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-2xl font-black text-primary">
              ${item.totalPrice}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
