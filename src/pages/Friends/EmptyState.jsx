import React from "react";
import { motion } from "framer-motion";
import { HiOutlineUserGroup } from "react-icons/hi";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const EmptyState = ({ title, description }) => {
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-[36px]
        bg-white/80
        backdrop-blur-xl
        border border-white/20
        p-12
        text-center
        shadow-[0_10px_40px_rgba(0,0,0,0.05)]
      "
    >
      <div
        className="
          mx-auto
          w-24 h-24
          rounded-[28px]
          bg-primary/10
          text-primary
          flex items-center justify-center
          mb-6
        "
      >
        <HiOutlineUserGroup size={45} />
      </div>

      <h2 className="text-2xl font-black text-gray-900">{title}</h2>

      <p className="text-gray-500 mt-3 max-w-md mx-auto">{description}</p>
    </motion.div>
  );
};

export default EmptyState;
