import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import p from "../../assets/images/Team/photo_2025-11-25_01-40-06.png";
import p1 from "../../assets/images/Team/0326__23-09-2025__Ghandi_Mallouhi_-_Copy-removebg-preview.jpg";
import p2 from "../../assets/images/Team/photo_2026-01-14_01-44-48.png";
import p3 from "../../assets/images/Team/moo.png";
const TeamSection = () => {
  const { t } = useTranslation();

  const team = [
    {
      id: 1,
      name: "Mjd Hanna",
      role: t("Frontend Developer (React)"),
      img: p1,
    },
    {
      id: 2,
      name: "Joy Yousef",
      role: t("Application Developer(Flutter)"),

      img: p2,
    },
    {
      id: 3,
      name: "Karam Anstas",
      role: t("Backend Developer (Laravel)"),
      img: p,
    },
    {
      id: 3,
      name: "Mohammad Ali",
      role: t("Application Developer(Flutter)"),
      img: p3,
    },
  ];

  return (
    <section className="mt-16">
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-semibold text-center mb-10"
      >
        {t("Our Team")}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-4">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center text-center"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover shadow mb-4"
            />
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-gray-600  mt-1">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
