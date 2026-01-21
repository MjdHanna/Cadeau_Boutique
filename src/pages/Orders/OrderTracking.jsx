import React, { memo, Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectToken } from "../../redux/features/authSlice";
import { useGetOrdersQuery } from "../../redux/features/apiSlice";

import EmptyState from "../../components/EmptyState/EmptyState";
import emptyImage from "../../assets/images/Cart/Frame.png";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderTracking = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);

  const { data, isLoading, isFetching, isError } = useGetOrdersQuery(
    undefined,
    { skip: !token },
  );

  const [openOrderId, setOpenOrderId] = useState(null); // للتحكم في Accordion

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

  const orders = data?.data || [];
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-25">
      <motion.h1
        className="text-3xl font-bold text-center mb-10 text-gray-800"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {t("Order Tracking")}
      </motion.h1>

      {hasOrders ? (
        <div className="max-w-5xl mx-auto space-y-4">
          {orders.map((order) => {
            const mappedOrder = {
              id: order.orderNumber,
              status: order.orderStatus,
              paymentStatus: order.paymentStatus,
              shippingName: order.shippingName || "-",
              shippingAddress: order.shippingAddress || "-",
              total: Number(order.total) || 0,
              date: order.date || null,
              items: Array.isArray(order.orderItems)
                ? order.orderItems.map((item) => ({
                    productId: item.product_id,
                    variantId: item.variant_id,
                    productName: item.name,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    total: Number(item.total),
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
                dir={isRTL ? "rtl" : "ltr"}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-6 cursor-pointer"
                  onClick={() => setOpenOrderId(isOpen ? null : mappedOrder.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {t("Order")} #{mappedOrder.id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                        statusColors[mappedOrder.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t(mappedOrder.status)}
                    </span>
                  </div>

                  <span className="text-gray-400 text-xl">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>

                {isOpen && (
                  <div className="p-6 border-t border-gray-200 space-y-4 text-sm text-gray-700">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">{t("Name")}:</span>{" "}
                        {mappedOrder.shippingName}
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
                        <span className="font-medium">{t("Payment")}:</span>{" "}
                        {t(mappedOrder.paymentStatus)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">{t("Items")}</h4>
                      {mappedOrder.items.length > 0 ? (
                        <ul className="space-y-2">
                          {mappedOrder.items.map((item, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.productName}
                                </p>
                                <p className="text-gray-500">
                                  {t("Quantity")}: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-700">
                                ${item.total.toFixed(2)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">{t("No items found")}</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t pt-4 mt-4">
                      <span className="font-semibold text-lg">
                        {t("Total")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ${mappedOrder.total.toFixed(2)}
                      </span>
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
