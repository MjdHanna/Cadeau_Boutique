import React from "react";
import { useTranslation } from "react-i18next";
const OrderSummary = ({ total, items, giftData }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";
  return (
    <div
      className="bg-white rounded-[32px] p-6 shadow-sm
      border border-gray-100 h-fit sticky top-5"
    >
      <h2 className="text-2xl font-black">{t("Order Summary")}</h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex justify-between">
            <span>{item.productName}</span>

            <span>${item.totalPrice}</span>
          </div>
        ))}

        {giftData.enabled && (
          <div className="flex justify-between text-primary font-bold">
            <span>{t("Gift Wrap")}</span>

            <span>+${giftData.coverPrice}</span>
          </div>
        )}

        <div className="border-t pt-5 flex justify-between">
          <span className="font-black text-xl">{t("Total")}</span>

          <span className="font-black text-2xl text-primary">${total}</span>
        </div>

        <button
          className="w-full mt-5 bg-primary text-white
          py-4 rounded-2xl font-bold hover:scale-[1.02]
          transition"
        >
          {t("Complete Order")}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
