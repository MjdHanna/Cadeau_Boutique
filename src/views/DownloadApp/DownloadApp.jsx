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
  const downloadUrl = "https://play.google.com";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 rounded-[50px] py-20 px-6 md:px-16 lg:py-28 my-12 shadow-2xl border border-slate-800/60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div
          className={`lg:col-span-6 flex flex-col justify-center ${isRTL ? "text-right order-1" : "text-left order-1"}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-primary text-xs font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("Mobile Experience")}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400"
          >
            {t("Get Bella Regalo")}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-lg"
          >
            {t(
              "Scan the QR code to instantly download the app and experience premium gifting at your fingertips. Available for iOS and Android.",
            )}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center gap-6 p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl w-fit shadow-inner"
          >
            <div className="p-3 bg-white rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105">
              <QRCode value={downloadUrl} size={120} level="H" />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-white font-bold text-lg mb-1">
                {t("Scan to Scan")}
              </h4>
              <p className="text-xs text-slate-400 max-w-[160px] leading-normal">
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
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full transform scale-75 pointer-events-none" />

          <div className="relative w-64 md:w-72 aspect-[9/18] rounded-[50px] overflow-hidden border-[6px] border-slate-800/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] group">
            <img
              src={phoneMockup}
              alt="Bella Regalo App Display"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="absolute -z-10 w-72 md:w-80 aspect-[9/18] rounded-[54px] border border-white/5 bg-white/[0.01] transform -rotate-3 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadApp;
