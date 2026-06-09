import { React, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineBell,
  HiUsers,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiGift,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { selectToken } from "../../redux/features/authSlice";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useSelector } from "react-redux";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const Notifications = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const notifications = [
    {
      id: 1,
      title: t("New Gift Card"),
      message: t("You received a gift card from Sarah."),
      time: "2 min",
      unread: true,
      icon: HiGift,
    },
    {
      id: 2,
      title: t("Order Delivered"),
      message: t("Your recent order has been delivered."),
      time: "10 min",
      unread: true,
      icon: HiOutlineShoppingBag,
    },
    {
      id: 3,
      title: t("Friend Request"),
      message: t("Ahmed sent you a friend request."),
      time: "1 hour",
      unread: false,
      icon: HiUsers,
    },
    {
      id: 4,
      title: t("Wishlist Update"),
      message: t("One of your wishlist items is on sale."),
      time: "3 hours",
      unread: false,
      icon: HiOutlineHeart,
    },
  ];
  if (!token) {
    return (
      <Suspense fallback={<div className="text-center py-28">Loading...</div>}>
        <LoginRequired
          message={t("Please login to access your Notifications")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <HiOutlineBell className="text-primary" />
            {t("Notifications")}
          </h1>

          <p className="text-gray-500 mt-2">
            {t("Stay updated with all your latest activities")}
          </p>
        </motion.div>

        <div className="space-y-4">
          {notifications.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  bg-white
                  rounded-3xl
                  p-5
                  shadow-sm
                  border
                  transition
                  hover:shadow-xl
                  hover:-translate-y-1
                  ${
                    item.unread
                      ? "border-primary/30 bg-primary/5"
                      : "border-gray-100"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      w-14 h-14
                      rounded-2xl
                      bg-primary/10
                      flex items-center justify-center
                    "
                  >
                    <Icon size={28} className="text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>

                        <p className="text-gray-600 mt-1">{item.message}</p>
                      </div>

                      <span className="text-sm text-gray-400">{item.time}</span>
                    </div>

                    {item.unread && (
                      <span
                        className="
                          inline-flex
                          mt-3
                          px-3
                          py-1
                          rounded-full
                          bg-primary/10
                          text-primary
                          text-xs
                          font-semibold
                        "
                      >
                        {t("New")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
