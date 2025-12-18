import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const OrderCard = memo(({ order }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white shadow-lg rounded-2xl border border-gray-200 p-5 mb-4 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800">
            {t("Order")} #{order.id}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {t(order.status)}
          </span>
        </div>
        <div className="text-gray-400">
          {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-gray-600"
          >
            <p>
              <span className="font-semibold">{t("Customer")}:</span>{" "}
              {order.customer}
            </p>
            <p>
              <span className="font-semibold">{t("Delivery Date")}:</span>{" "}
              {order.deliveryDate}
            </p>
            <p>
              <span className="font-semibold">{t("Items")}:</span>{" "}
              {(order.items || []).join(", ") || t("No items")}
            </p>

            <p>
              <span className="font-semibold">{t("Total")}:</span> $
              {order.total}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default OrderCard;
