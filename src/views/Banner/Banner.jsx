import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import banner2 from "../../assets/images/Banner/p1.png";
import banner3 from "../../assets/images/Banner/p2.png";
import banner1 from "../../assets/images/Banner/p3.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";

const Banner = () => {
  const { t, i18n } = useTranslation();
  const lang = useSelector(selectTranslate);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      url: banner2,
      title: t("CelebrateEveryMoment"),
      subtitle: t("FindBeautifulGiftsAndFlowers"),
    },
    {
      url: banner1,
      title: t("DelightWithChocolate"),
      subtitle: t("HandcraftedChocolatesForEveryOccasion"),
    },
    {
      url: banner3,
      title: t("GiftsForLovedOnes"),
      subtitle: t("MakeSpecialDaysUnforgettable"),
    },
  ];

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, i18n]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[calc(100vh-65px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentImageIndex].url}
            alt="Banner"
            className="w-full h-screen md:h-full object-cover object-top md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {images[currentImageIndex].title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10">
                  {images[currentImageIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-16 flex gap-3">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentImageIndex === index
                      ? "bg-primary"
                      : "bg-secondary hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-[1]" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
    </div>
  );
};

export default Banner;
