import { HiGift } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const GiftCardCard = ({ card, received = false }) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        {received ? (
          card?.sender?.image ? (
            <img
              src={card.sender.image}
              alt={card.sender.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <HiGift className="text-xl text-primary" />
            </div>
          )
        ) : card?.receiver?.image ? (
          <img
            src={card.receiver.image}
            alt={card.receiver.name}
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <HiGift className="text-xl text-primary" />
          </div>
        )}

        <div>
          <h3 className="font-bold text-lg">
            {received ? card?.sender?.name : card?.receiver?.name || "Unknown"}
          </h3>

          <p className="text-xs text-gray-500">
            {received ? t("Received Gift") : t("Sent Gift")}
          </p>
        </div>
      </div>

      {card?.message && (
        <p className="text-gray-500 mt-3 italic">"{card.message}"</p>
      )}

      <div className="mt-4">
        <span className="font-semibold text-lg text-primary">
          ${card?.budget}
        </span>
      </div>

      {card?.items?.length > 0 && (
        <div className="mt-5 space-y-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">
            {t("Gift Items")}
          </h4>

          {card.items.map((item) => (
            <div
              key={item.productId}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-3"
            >
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.nameEn}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold">
                    {i18n.language === "ar" ? item.nameAr : item.nameEn}
                  </p>

                  <p className="text-xs text-gray-500">{item.quantity} ×</p>
                </div>
              </div>

              {item.variants?.length > 0 && (
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  {item.variants.map((v) => (
                    <div key={v.variantId} className="flex flex-wrap gap-2">
                      <span>💰 {v.price}$</span>
                      <span>📦 {v.stock}</span>

                      {v.attributesEn &&
                        Object.entries(v.attributesEn).map(([key, value]) => (
                          <span key={key}>
                            {key}: {value}
                          </span>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {received && (
        <Link
          to={`/gift-cards/redeem/${card.id}`}
          className="inline-flex mt-5 px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
        >
          {t("Redeem")}
        </Link>
      )}
    </motion.div>
  );
};

export default GiftCardCard;
