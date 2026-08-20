import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import { selectTranslate } from "../../redux/features/translateSlice";

import phoneMockup from "../../assets/images/DownLoad App/photo_2026-07-01_13-33-36.jpg";

const DownloadApp = () => {
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();

  const isRTL = lang === "ar";
  const downloadUrl =
    "https://drive.google.com/file/d/1RW_mc2Ks840oqn7nv_lOpcUdnG6vXDAL/view?usp=drivesdk";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2d0a1d] via-[#1a0511] to-[#0d0208] rounded-[40px] md:rounded-[50px] py-20 px-6 md:px-16 lg:py-28 my-12 shadow-[0_25px_60px_-15px_rgba(126,37,83,0.3)] border border-[#7e2553]/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#7e2553]/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#D4AF37]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#7e2553]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div
          className={`lg:col-span-6 flex flex-col justify-center ${
            isRTL ? "text-right order-1" : "text-left order-1"
          }`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#7e2553]/20 border border-[#D4AF37]/40 backdrop-blur-md text-[#F3E5AB] text-xs font-semibold tracking-widest uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              {t("Mobile Experience")}
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-[#d9d9d9] text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37]"
          >
            {t("Get Wishly")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-[#d9d9d9]/80 text-base md:text-lg leading-relaxed max-w-lg font-normal"
          >
            {t(
              "Scan the QR code to instantly download the app and experience premium gifting at your fingertips. Available for iOS and Android.",
            )}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-[#D4AF37]/30 backdrop-blur-xl w-fit shadow-2xl relative group"
          >
            <div className="p-3 bg-white rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 border border-[#D4AF37]/20">
              <QRCode
                value={downloadUrl}
                size={115}
                level="H"
                fgColor="#2d0a1d"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs text-[#d9d9d9]/70 max-w-[160px] leading-normal">
                {t(
                  "Point your phone camera at the code to download instantly.",
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="lg:col-span-6 flex justify-center items-center relative order-2"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#7e2553]/40 via-[#D4AF37]/20 to-transparent blur-3xl rounded-full transform scale-90 pointer-events-none" />
          <div className="relative w-64 md:w-72 aspect-[9/18] rounded-[50px] overflow-hidden border-[6px] border-[#7e2553]/60 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] group hover:border-[#D4AF37]/60 transition-colors duration-500">
            <img
              src={phoneMockup}
              alt="Bella Regalo App Display"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0208]/60 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="absolute -z-10 w-72 md:w-80 aspect-[9/18] rounded-[54px] border border-[#D4AF37]/30 bg-[#7e2553]/10 transform -rotate-3 pointer-events-none backdrop-blur-[2px]" />
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadApp;
