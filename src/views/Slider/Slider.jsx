import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useRef, useMemo } from "react";
import { useGetCategoriesQuery } from "../../redux/features/apiSlice";
import CategoryCard from "../../components/Categories/CategoryCard/CategoryCard";
import { useTranslation } from "react-i18next";

const Slider = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((cat) => ({
      ...cat,
      categoryName:
        i18n.language === "ar"
          ? cat.categoryNameArabic
          : cat.categoryNameEnglish,
      categoryDescription:
        i18n.language === "ar"
          ? cat.categoryDescriptionArabic
          : cat.categoryDescriptionEnglish,
    }));
  }, [data, i18n.language]);

  const handleCategoryClick = (cat) => {
    navigate(`/categories/${cat.categoryId}`);
  };

  if (error) {
    return (
      <p className="text-center my-20 text-red-500">
        {t("Failed to load categories")}
      </p>
    );
  }
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-24 flex items-center justify-center">
            <div className="loader border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="mb-6 text-center md:text-start">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("Categories")}
          </h2>
          <div className="mt-2 mx-auto md:mx-0 w-24 h-1 rounded-full bg-gradient-to-r from-primary to-primary/30" />
        </div>
        <div className="absolute left-0 top-20 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-20 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={16}
          slidesPerView={3}
          loop
          speed={1200}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          className="py-4"
          aria-roledescription="carousel"
        >
          {categories.map((cat) => (
            <SwiperSlide
              key={cat.categoryId}
              className="flex items-center justify-center"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleCategoryClick(cat)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleCategoryClick(cat);
                }}
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
                className="w-full px-2 text-sm py-5"
                aria-label={
                  i18n.language === "ar"
                    ? `فتح ${cat.categoryName}`
                    : `Open ${cat.categoryName}`
                }
              >
                <div className="bg-white   cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary">
                  <CategoryCard category={cat} compact />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Slider;
