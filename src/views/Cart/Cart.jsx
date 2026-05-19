import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import CartItem from "./CartItem";
import GiftExperience from "./GiftExperience";
import OrderSummary from "./OrderSummary";

const staticCartItems = [
  {
    cartItemId: 1,
    productName: "Luxury Watch",
    quantity: 1,
    totalPrice: 120,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    cartItemId: 2,
    productName: "Elegant Perfume",
    quantity: 2,
    totalPrice: 80,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
  },
];

const Cart = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const [giftData, setGiftData] = useState({
    enabled: true,

    occasion: "birthday",

    coverId: 1,

    coverPrice: 8,

    message: "",

    recipientType: "self",

    selectedFollower: null,

    recipient: {
      name: "",
      phone: "",
      address: "",
    },

    deliveryDate: "",
  });

  const total = useMemo(() => {
    const itemsTotal = staticCartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return itemsTotal + (giftData.enabled ? giftData.coverPrice : 0);
  }, [giftData]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-7xl mx-auto px-4 py-26">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black mb-10"
        >
          {t("Shopping Cart")}
        </motion.h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            {staticCartItems.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
            <GiftExperience giftData={giftData} setGiftData={setGiftData} />
          </div>
          <OrderSummary
            total={total}
            items={staticCartItems}
            giftData={giftData}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
