// src/components/Slider/Slider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useRef, useMemo } from "react";
import { useGetCategoriesQuery } from "../../redux/features/apiSlice"; // استخدم hook المناسب
import CategoryCard from "../../components/Categories/CategoryCard/CategoryCard";
import { useTranslation } from "react-i18next";

const Slider = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useGetCategoriesQuery(); // افترضنا query

  const categories = useMemo(() => data?.data || [], [data]);

  const handleCategoryClick = (cat) => {
    navigate(`/categories/${cat.categoryId}`);
  };

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

  if (error) {
    return (
      <p className="text-center my-20 text-red-500">
        {t("Failed to load brands")}
      </p>
    );
  }

  return (
    <div className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* subtle gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={16}
          slidesPerView={3}
          loop={true}
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
                className="w-full px-2"
                aria-label={`فتح ${cat.categoryName}`}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary">
                  <CategoryCard category={cat} compact />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
