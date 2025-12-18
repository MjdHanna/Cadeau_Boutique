import { useTranslation } from "react-i18next";

const ShowData = ({ title, items, renderItem }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl sm:text-3xl font-bold mb-10 text-gray-800 
  w-full ${isRTL ? "text-right" : "text-left"} 
  flex sm:block justify-center sm:justify-start`}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.05]"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowData;
