import React, { memo, Suspense, lazy, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectToken } from "../../redux/features/authSlice";
import {
  useGetOrdersQuery,
  useGetOrderHistoryQuery,
} from "../../redux/features/apiSlice";

import EmptyState from "../../components/EmptyState/EmptyState";
import emptyImage from "../../assets/images/Cart/Frame.png";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const statusColors = {
  delivered: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
};

const OrderTracking = () => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const token = useSelector(selectToken);

  const [openOrderId, setOpenOrderId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const currentOrdersQuery = useGetOrdersQuery(undefined, {
    skip: !token,
  });

  const historyOrdersQuery = useGetOrderHistoryQuery(undefined, {
    skip: !token,
  });

  const currentOrders = currentOrdersQuery.data?.data || [];

  const historyOrders = historyOrdersQuery.data?.data || [];
  const orders = useMemo(() => {
    return [...(showHistory ? historyOrders : currentOrders)].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [showHistory, historyOrders, currentOrders]);
  const isLoading =
    currentOrdersQuery.isLoading || historyOrdersQuery.isLoading;

  const isFetching =
    currentOrdersQuery.isFetching || historyOrdersQuery.isFetching;

  const isError = currentOrdersQuery.isError || historyOrdersQuery.isError;

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

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
          message={t("Please login to track your orders")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-28 text-red-500 font-medium">
        {t("Failed to load orders")}
      </div>
    );
  }

  const hasOrders = orders.length > 0;

  const recipientLabels = {
    self: t("Myself"),
    friend: t("Friend"),
    manual: t("Manual Recipient"),
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50 px-6 py-25"
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-10 text-gray-800"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {t("Order Tracking")}
      </motion.h1>
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-2xl shadow-md flex">
          <button
            onClick={() => {
              setShowHistory(false);
              setOpenOrderId(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !showHistory
                ? "bg-primary text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("Active Orders")}
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {currentOrders.length}
            </span>
          </button>

          <button
            onClick={() => {
              setShowHistory(true);
              setOpenOrderId(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              showHistory
                ? "bg-primary text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("Order History")}
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {historyOrders.length}
            </span>
          </button>
        </div>
      </div>

      {hasOrders ? (
        <div className="max-w-5xl mx-auto space-y-4">
          {orders.map((order) => {
            const mappedOrder = {
              id: order.orderNumber,

              status: order.orderStatus,

              paymentStatus: order.paymentStatus,

              recipientType: order.recipientType,

              shippingName: order.shippingName || "-",

              shippingPhone:
                order.shippingPhone ||
                order.shipping_phone ||
                order.phone ||
                "-",

              shippingAddress: order.shippingAddress || "-",

              deliveryDate:
                order.date || order.delivery_date || order.shippingDate || null,

              giftMessage: order.giftMessage || "",

              couponCode: order.couponCode || "",

              couponDiscount: Number(order.couponDiscount || 0),

              giftWrapper: order.giftWrapper || null,

              total: Number(order.total) || 0,

              subtotal: Number(order.subtotal || 0),

              date: order.date || null,

              items: Array.isArray(order.orderItems)
                ? order.orderItems.map((item) => ({
                    productId: item.product_id,

                    variantId: item.variant_id,

                    productName:
                      item.productNameArabic ||
                      item.productNameEnglish ||
                      item.name ||
                      t("Unknown Product"),

                    sku: item.sku || "",

                    quantity: Number(item.quantity || 0),

                    price: Number(item.price || 0),

                    attributes: item.attributes || {},

                    total:
                      Number(item.total) ||
                      Number(item.price || 0) * Number(item.quantity || 0),
                  }))
                : [],
            };

            const isOpen = openOrderId === mappedOrder.id;

            return (
              <motion.div
                key={mappedOrder.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="
                  bg-white
                  rounded-2xl
                  shadow-md
                  border
                  border-gray-200
                  overflow-hidden
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    items-center
                    p-6
                    cursor-pointer
                  "
                  onClick={() => setOpenOrderId(isOpen ? null : mappedOrder.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {t("Order")} #{mappedOrder.id}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {mappedOrder.items.length} {t("Items")}
                      </p>
                    </div>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium w-fit
                        ${
                          statusColors[mappedOrder.status] ||
                          "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {t(mappedOrder.status)}
                    </span>
                  </div>

                  <span className="text-gray-400 text-xl">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>

                {isOpen && (
                  <div className="p-6 border-t border-gray-200 space-y-6">
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">
                          {t("Recipient's ID")}:
                        </span>{" "}
                        {recipientLabels[mappedOrder.recipientType] ||
                          mappedOrder.recipientType}
                      </p>

                      <p>
                        <span className="font-medium">{t("Name")}:</span>{" "}
                        {mappedOrder.shippingName}
                      </p>

                      <p>
                        <span className="font-medium">{t("Phone")}:</span>{" "}
                        {mappedOrder.shippingPhone}
                      </p>

                      <p>
                        <span className="font-medium">{t("Address")}:</span>{" "}
                        {mappedOrder.shippingAddress}
                      </p>

                      <p>
                        <span className="font-medium">{t("Order Date")}:</span>{" "}
                        {mappedOrder.date
                          ? new Date(mappedOrder.date).toLocaleString(
                              isRTL ? "ar-EG" : "en-US",
                            )
                          : "-"}
                      </p>

                      <p>
                        <span className="font-medium">
                          {t("Delivery Date")}:
                        </span>{" "}
                        {mappedOrder.deliveryDate
                          ? new Date(
                              mappedOrder.deliveryDate,
                            ).toLocaleDateString(isRTL ? "ar-EG" : "en-US")
                          : "-"}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="font-medium">{t("Payment")}:</span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            paymentStatusColors[mappedOrder.paymentStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {t(mappedOrder.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    {mappedOrder.giftMessage && (
                      <div
                        className="
                          bg-primary/5
                          border border-primary/10
                          rounded-2xl
                          p-5
                        "
                      >
                        <h4 className="font-bold text-lg mb-2">
                          🎁 {t("Gift Message")}
                        </h4>

                        <p className="text-gray-700 italic leading-7">
                          "{mappedOrder.giftMessage}"
                        </p>
                      </div>
                    )}
                    {mappedOrder.couponCode && (
                      <div
                        className="
                          bg-green-50
                          border border-green-100
                          rounded-2xl
                          p-5
                        "
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-green-700">
                              🎟️ {t("Coupon Applied")}
                            </h4>

                            <p className="text-sm text-green-600 mt-1">
                              {mappedOrder.couponCode}
                            </p>
                          </div>

                          {mappedOrder.couponDiscount > 0 && (
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {t("Discount")}
                              </p>

                              <p className="font-black text-green-700 text-lg">
                                -${mappedOrder.couponDiscount.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-4 text-lg">
                        {t("Items")}
                      </h4>

                      {mappedOrder.items.length > 0 ? (
                        <ul className="space-y-4">
                          {mappedOrder.items.map((item, index) => (
                            <li
                              key={index}
                              className="
    flex
    justify-between
    items-start
    border
    border-gray-100
    rounded-2xl
    p-4
  "
                            >
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">
                                  {item.productName}
                                </p>

                                {item.sku && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    SKU: {item.sku}
                                  </p>
                                )}

                                <p className="text-sm text-gray-500 mt-1">
                                  {t("Quantity")}: {item.quantity}
                                </p>

                                <p className="text-sm text-gray-500">
                                  {t("Price")}: ${item.price.toFixed(2)}
                                </p>

                                {Object.keys(item.attributes || {}).length >
                                  0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {Object.entries(item.attributes).map(
                                      ([key, value]) => (
                                        <span
                                          key={key}
                                          className="
              px-2
              py-1
              text-xs
              rounded-full
              bg-gray-100
              text-gray-600
            "
                                        >
                                          {key}: {value}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-primary text-lg">
                                  ${item.total.toFixed(2)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">{t("No items found")}</p>
                      )}
                    </div>

                    <div className="border-t pt-5 space-y-3">
                      {mappedOrder.subtotal > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>{t("Subtotal")}</span>

                          <span>${mappedOrder.subtotal.toFixed(2)}</span>
                        </div>
                      )}

                      {mappedOrder.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>{t("Coupon Discount")}</span>

                          <span>-${mappedOrder.couponDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3">
                        <span className="font-black text-xl">{t("Total")}</span>

                        <span className="text-2xl font-black text-primary">
                          ${mappedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          imageSrc={emptyImage}
          titleKey={t("No Orders Yet")}
          descriptionKey={t("You haven't placed any orders yet.")}
        />
      )}
    </div>
  );
};

export default memo(OrderTracking);
