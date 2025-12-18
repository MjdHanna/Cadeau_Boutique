import React, { memo, Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const EmptyState = memo(({ imageSrc, titleKey, descriptionKey }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 sm:py-32">
      <Suspense
        fallback={
          <div className="w-40 h-40 sm:w-60 sm:h-60 bg-gray-200 rounded-lg animate-pulse mb-6" />
        }
      >
        <motion.img
          src={imageSrc}
          alt="Empty State"
          loading="lazy"
          className="w-40 h-40 sm:w-60 sm:h-60 object-contain mb-6 opacity-90"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        />
      </Suspense>

      <motion.h2
        className="text-lg sm:text-xl font-semibold text-gray-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {t(titleKey)}
      </motion.h2>

      {descriptionKey && (
        <motion.p
          className="text-sm sm:text-lg text-gray-500 mt-2 max-w-md"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {t(descriptionKey)}
        </motion.p>
      )}
    </div>
  );
});
export default EmptyState;
