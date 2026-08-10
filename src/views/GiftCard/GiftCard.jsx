import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  HiGift,
  HiOutlineArrowRight,
  HiOutlinePlusCircle,
  HiOutlineInbox,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  useGetReceivedGiftCardsQuery,
  useGetSentGiftCardsQuery,
} from "../../redux/features/apiSlice";

import { selectTranslate } from "../../redux/features/translateSlice";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const GiftCardSection = () => {
  const { t } = useTranslation();
  const lang = useSelector(selectTranslate);

  const { data: receivedData, isLoading: receivedLoading } =
    useGetReceivedGiftCardsQuery(undefined, {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  const { data: sentData, isLoading: sentLoading } = useGetSentGiftCardsQuery(
    undefined,
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const receivedCount = useMemo(() => {
    if (!Array.isArray(receivedData?.data)) return 0;
    return receivedData.data.filter((card) => card.status !== "redeemed")
      .length;
  }, [receivedData]);

  const sentCount = useMemo(() => {
    if (!Array.isArray(sentData?.data)) return 0;
    return sentData.data.filter((card) => card.status !== "redeemed").length;
  }, [sentData]);

  const cards = useMemo(
    () => [
      {
        title: t("Sent Gift Cards"),
        count: sentCount,
        loading: sentLoading,
        icon: <HiOutlinePaperAirplane className="text-3xl text-primary" />,
        path: "/gift-cards/sent",
        create: false,
        theme: "primary",
        bgClass: "bg-primary/10",
        hoverShadow: "hover:shadow-primary/20",
      },
      {
        title: t("Received Gift Cards"),
        count: receivedCount,
        loading: receivedLoading,
        icon: <HiOutlineInbox className="text-3xl text-emerald-600" />,
        path: "/gift-cards/received",
        create: false,
        theme: "emerald",
        bgClass: "bg-emerald-50",
        hoverShadow: "hover:shadow-emerald-500/20",
      },
      {
        title: t("Create Gift Card"),
        icon: <HiOutlinePlusCircle className="text-3xl text-amber-600" />,
        path: "/gift-cards/create",
        create: true,
        theme: "amber",
        bgClass: "bg-amber-50",
        hoverShadow: "hover:shadow-amber-500/20",
      },
    ],
    [t, sentCount, receivedCount, sentLoading, receivedLoading],
  );

  return (
    <section className="relative w-full overflow-hidden bg-gray-50/50 py-16 lg:py-24">
      {/* خلفية تزيينية بسيطة */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm"
          >
            <HiGift className="text-lg animate-pulse" />
            <span>{t("Gift Cards")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          >
            {t("Share Happiness")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600"
          >
            {t(
              "Create personalized gift cards and send them to your friends and family.",
            )}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          {cards.map((card) => (
            <motion.div key={card.path} variants={itemVariants}>
              <Link
                to={card.path}
                aria-label={card.title}
                className="block h-full outline-none"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative h-full bg-white rounded-3xl border border-gray-100 p-7 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-2xl ${card.hoverShadow} overflow-hidden`}
                >
                
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.theme === "primary" ? "from-primary/40 to-primary" : card.theme === "emerald" ? "from-emerald-400 to-emerald-600" : "from-amber-400 to-amber-600"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 ${card.bgClass} group-hover:bg-white group-hover:shadow-md`}
                  >
                    {card.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {card.title}
                  </h3>

                  {!card.create ? (
                    <div className="mt-4 flex items-center h-8">
                      {card.loading ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
                          <span className="text-sm font-medium text-gray-500">
                            {t("Loading...")}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-700 text-sm font-semibold shadow-sm">
                          {card.count} {t("Cards")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                      {t("Create and send a personalized gift card")}
                    </p>
                  )}

                  <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                      {card.create ? t("Create Now") : t("View Details")}
                    </span>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${
                        card.create
                          ? "bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white"
                          : card.theme === "emerald"
                            ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      <HiOutlineArrowRight
                        className={`text-lg transition-transform duration-300 group-hover:translate-x-1 ${
                          lang === "ar"
                            ? "rotate-180 group-hover:-translate-x-1"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default memo(GiftCardSection);
