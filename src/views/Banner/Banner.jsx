import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useGetAdsQuery } from "../../redux/features/apiSlice";

const Banner = () => {
  const { t, i18n } = useTranslation();
  const lang = useSelector(selectTranslate);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: adsResponse, isLoading, isError } = useGetAdsQuery();
  const ads = adsResponse?.data || [];

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, i18n]);

  useEffect(() => {
    if (ads.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % ads.length);
      }, 6000); // جعلتها 6 ثواني ليكون التغيير أهدأ
      return () => clearInterval(timer);
    }
  }, [ads.length]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-65px)] flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || ads.length === 0) return null;

  const currentAd = ads[currentImageIndex];

  return (
    <div className="relative h-[calc(100vh-65px)] w-full overflow-hidden bg-black group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentAd.addImage}
            alt={currentAd.addTitle}
            className="w-full h-full object-cover object-center opacity-80"
          />
          {/* طبقة تدرج لوني احترافية لضمان وضوح النص */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* المحتوى (النصوص والزر) */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            {/* عنوان الإعلان */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              {currentAd.addTitle}
            </h1>

            {/* زر الانتقال للمنتج */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/adds/${currentAd.addId}`)}
              className="mt-4 px-8 py-4 bg-primary text-white text-lg font-bold rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <span>
                {lang === "ar" ? "تسوق العرض الآن" : "Shop Offer Now"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${lang === "ar" ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* أزرار التنقل السفلية (Dots) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all duration-500 rounded-full ${
              currentImageIndex === index
                ? "w-10 h-3 bg-primary"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
