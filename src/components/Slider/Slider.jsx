import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

// ✅ Fake Data مؤقتاً
const fakeCategories = [
  { id: 1, name: "عيد ميلاد" },
  { id: 2, name: "أطفال" },
  { id: 3, name: "حب وورود" },
  { id: 4, name: "تهنئة" },
  { id: 5, name: "تخرج" },
  { id: 6, name: "أم وأب" },
  { id: 7, name: "ذكرى سنوية" },
  { id: 8, name: "صداقات" },
];

const Slider = () => {
  const navigate = useNavigate();

  // const { data, isLoading, isError } = useGetCategoriesQuery();
  // const categories = data?.data || [];

  const categories = fakeCategories;

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat.name)}`);
  };

  return (
    <div className="py-6">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={3}
          loop={true}
          speed={2500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
          className="py-6"
          style={{ flexWrap: "nowrap" }}
        >
          {categories.map((cat) => (
            <SwiperSlide
              key={cat.id}
              className="flex items-center justify-center cursor-pointer"
            >
              <div
                className="w-20 h-20 flex items-center justify-center rounded-full border border-gray-300 text-[14px] font-semibold hover:scale-110 transition-all duration-300 hover:text-primary"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.name}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slider;
