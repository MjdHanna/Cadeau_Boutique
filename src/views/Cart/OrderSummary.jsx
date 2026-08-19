import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const OrderSummary = ({
  total,
  items,
  giftData,
  onOrderSuccess,
  isProcessing,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // تم حذف عملية الـ checkout من هنا لأنها تتم في الـ Cart.jsx

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 h-fit sticky top-5"
    >
      <h2 className="text-2xl font-black">{t("Order Summary")}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-center justify-between"
          >
            <span className="text-gray-700">{item.productName}</span>
            <span className="font-bold">${item.totalPrice}</span>
          </div>
        ))}

        {giftData.enabled && (
          <div className="flex justify-between text-primary font-bold">
            <span>{t("Gift Wrap")}</span>
            <span>+${giftData.coverPrice}</span>
          </div>
        )}

        <div className="border-t pt-5 flex items-center justify-between">
          <span className="font-black text-xl">{t("Total")}</span>
          <span className="font-black text-2xl text-primary">${total}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={onOrderSuccess} // هنا نكتفي بمناداة الدالة لحساب السعر وفتح النافذة
          disabled={isProcessing}
          className={`w-full mt-5 py-4 rounded-2xl font-bold text-white transition-all ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:shadow-lg"
          }`}
        >
          {isProcessing ? t("Processing...") : t("Complete Order")}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
