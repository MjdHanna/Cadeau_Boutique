import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { selectToken } from "../../redux/features/authSlice";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../../redux/features/apiSlice";

import EmptyState from "../../components/EmptyState/EmptyState";
import p from "../../assets/images/Cart/Frame.png";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const Cart = () => {
  const token = useSelector(selectToken);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    data: cartData,
    isLoading,
    isFetching,
  } = useGetCartQuery(undefined, {
    skip: !token,
  });

  const [removeFromCart, { isLoading: removing }] = useRemoveFromCartMutation();

  /* 🔒 غير مسجل دخول */
  if (!token) {
    return (
      <Suspense
        fallback={
          <div className="text-center py-28 text-lg font-medium opacity-60">
            Loading...
          </div>
        }
      >
        <LoginRequired
          message={t("Please login to view your cart")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  /* ⏳ تحميل */
  if (isLoading || isFetching) {
    return (
      <div className="text-center py-28 text-lg font-medium opacity-60">
        {t("Loading cart...")}
      </div>
    );
  }

  /* 🛒 سلة فارغة */
  if (!cartData || cartData.items?.length === 0) {
    return (
      <EmptyState imageSrc={p} descriptionKey="Add items to start shopping" />
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-10 space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Title */}
      <h2 className="text-2xl font-bold">{t("Your Cart")}</h2>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartData.items.map((item) => (
          <motion.div
            key={`${item.productId}-${item.variantId}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between
              gap-4 bg-white rounded-2xl p-5 shadow-md"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                />
              )}

              <div>
                <h3 className="font-semibold text-lg">{item.productName}</h3>
                <p className="text-sm text-gray-500">
                  {t("Quantity")}: {item.quantity}
                </p>
                <p className="text-sm font-medium text-primary">
                  ${item.price}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              disabled={removing}
              onClick={() =>
                removeFromCart({
                  productId: item.productId,
                  variantId: item.variantId,
                })
              }
              className="text-red-500 font-medium hover:underline
                disabled:opacity-50 self-start sm:self-auto"
            >
              {t("Remove")}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer / Total */}
      {cartData.total && (
        <div className="flex justify-end pt-6 border-t">
          <p className="text-xl font-bold">
            {t("Total")}: ${cartData.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
