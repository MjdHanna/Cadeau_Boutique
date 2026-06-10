import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const TeamSection = lazy(
  () => import("../../components/TeamSection/TeamSection"),
);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-50  px-6 py-24"
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl font-bold mb-6"
        >
          {t("About Us")}
        </motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-gray-600  text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
        >
          {t(
            "We are a creative platform specialized in organizing and designing gifts for special occasions. Our goal is to make every moment unforgettable.",
          )}
        </motion.p>

        <motion.img
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          src="https://knowxbox.com/blogs/wp-content/uploads/2025/03/6532431a769b1188055b60c1_teamwork-concept-on-the-brown-wooden-table-background.jpeg"
          alt="Our Team"
          className="w-full max-w-3xl mx-auto rounded-2xl shadow-md mt-10"
        />

        <Suspense
          fallback={
            <div className="text-gray-400 mt-10">{t("Loading team...")}</div>
          }
        >
          <TeamSection />
        </Suspense>
      </div>
    </main>
  );
};

export default AboutUs;
