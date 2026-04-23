import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/NavBar/a_logo_for_a_gift_app_named_bella_regalo_keep_the_exact_icon_from.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  }),
};
const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4"
    >
      <Suspense
        fallback={
          <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse mb-6" />
        }
      >
        <motion.img
          src={logo}
          alt="logo"
          loading="lazy"
          className="w-28 h-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </Suspense>
      <motion.h1
        className="text-7xl font-extrabold text-primary mb-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0.2}
      >
        404
      </motion.h1>
      <motion.h2
        className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0.3}
      >
        {t("Page Not Found")}
      </motion.h2>
      <motion.p
        className="text-gray-500 text-lg max-w-md mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0.4}
      >
        {t("Sorry, the page you are looking for doesn't exist.")}
      </motion.p>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0.5}
      >
        <Link
          to="/"
          className="bg-primary text-white px-6 py-3 rounded-xl text-lg font-medium shadow-md hover:bg-primary/90 transition"
        >
          {t("Back to Home")}
        </Link>
      </motion.div>
    </div>
  );
};
export default NotFoundPage;
