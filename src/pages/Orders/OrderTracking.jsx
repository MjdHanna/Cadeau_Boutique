import React, { memo, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import OrderCard from "../../components/Orders/OrderCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import emptyImage from "../../assets/images/Cart/Frame.png";

const LoginRequired = lazy(() =>
  import("../../components/LoginRequired/LoginRequired")
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const OrderTracking = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);

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

  const orders = [
    {
      id: "A123",
      customer: "Mjd Hanna",
      deliveryDate: "2025-11-12",
      status: "Pending",
    },
    {
      id: "B456",
      customer: "Antoine Al-rkan",
      deliveryDate: "2025-11-15",
      status: "Delivered",
    },
  ];

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

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        {hasOrders ? (
          <div className="max-w-5xl mx-auto grid gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            imageSrc={emptyImage}
            titleKey="No Orders Yet"
            descriptionKey="You haven't placed any orders yet."
          />
        )}
      </Suspense>
    </div>
  );
};

export default memo(OrderTracking);
