import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
// import {
//   useGetNotificationsQuery,
//   useMarkNotificationAsReadMutation,
// } from "../../redux/features/apiSlice";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const isRtl = i18n.language === "ar";

  // const { data: notificationsResponse, isLoading } = useGetNotificationsQuery(
  //   undefined,
  //   { skip: !token },
  // );
  // const [markAsRead] = useMarkNotificationAsReadMutation();

  const notifications = [];
  const isLoading = false;
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (!token) {
    return (
      <Suspense
        fallback={
          <div className="text-center py-28 text-gray-500">جاري التحميل...</div>
        }
      >
        <LoginRequired
          message={t("Please login to access your Notifications")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <HiOutlineBell className="text-primary w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {t("Notifications")}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {t("Stay updated with all your latest activities")}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button className="text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
              <HiOutlineCheck size={18} />
              {t("Mark all as read")}
            </button>
          )}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              // Loading Skeleton
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-4 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : notifications.length > 0 ? (
              notifications.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !item.is_read && handleMarkAsRead(item.id)}
                  className={`
                    group cursor-pointer relative overflow-hidden
                    bg-white rounded-2xl p-5 sm:p-6
                    transition-all duration-300
                    hover:shadow-lg hover:-translate-y-0.5
                    ${!item.is_read ? "border-l-4 border-l-primary shadow-sm" : "border border-gray-100 opacity-75"}
                  `}
                >
                  {/* Background pattern for unread */}
                  {!item.is_read && (
                    <div
                      className={`absolute top-0 ${isRtl ? "left-0" : "right-0"} w-24 h-24 bg-primary/5 rounded-full blur-2xl -mt-10 ${isRtl ? "-ml-10" : "-mr-10"}`}
                    ></div>
                  )}

                  <div className="flex items-start gap-4 relative z-10">
                    <div
                      className={`
                      w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors
                      ${!item.is_read ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500 group-hover:text-primary group-hover:bg-primary/5"}
                    `}
                    >
                      <HiOutlineBell size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3
                          className={`font-semibold truncate ${!item.is_read ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                          {item.created_at || "الآن"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.message || item.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed"
              >
                <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <HiOutlineBell className="text-gray-300 w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("No Notifications Yet")}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {t("When you get notifications, they'll show up here.")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
