import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useRef, useMemo, useEffect } from "react";
import { useGetOccasionsQuery } from "../../redux/features/apiSlice";
import { useTranslation } from "react-i18next";

const OccasionSlider = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const { i18n, t } = useTranslation();
  const { data, isLoading, error } = useGetOccasionsQuery();

  /* ================= Occasions ================= */
  const occasions = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((o) => ({
      ...o,
      occasionName:
        i18n.language === "ar" ? o.occasionNameArabic : o.occasionNameEnglish,
    }));
  }, [data, i18n.language]);
  const repeatedOccasions = useMemo(() => {
    if (!occasions.length) return [];
    return [...occasions, ...occasions, ...occasions];
  }, [occasions]);

  useEffect(() => {
    swiperRef.current?.autoplay?.start();
  }, [repeatedOccasions.length]);

  if (isLoading) return null;

  if (error) {
    return (
      <p className="text-center my-10 text-red-500">
        {t("Failed to load occasions")}
      </p>
    );
  }

  return (
    <section className="py-8 ">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="mb-6 text-center md:text-start ">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t("Occasions")}
          </h2>
          <div className="mt-2 mx-auto md:mx-0 w-24 h-1 rounded-full bg-gradient-to-r from-primary to-primary/30" />
        </div>
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView="auto"
          spaceBetween={16}
          loop
          speed={1500}
          allowTouchMove={false}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          className="py-4"
        >
          {repeatedOccasions.map((o, index) => (
            <SwiperSlide
              key={`${o.occasionId}-${index}`}
              className="!w-[140px] flex items-stretch"
            >
              {/* Wrapper يعطي نفسًا عموديًا */}
              <div className="w-full px-2 py-6">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/occasions/${o.occasionId}`)}
                  onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                  onMouseLeave={() => swiperRef.current?.autoplay.start()}
                  className="bg-white rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={o.occasionImage}
                    alt={o.occasionName}
                    className="w-full h-24 object-cover rounded-xl mb-3"
                  />
                  <h3
                    title={o.occasionName}
                    className="pb-3 font-semibold text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {o.occasionName}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OccasionSlider;
