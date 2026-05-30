import React from "react";
import { useTranslation } from "react-i18next";

const covers = [
  {
    id: 1,
    name: "Birthday Cover",
    price: 5,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
  },
  {
    id: 2,
    name: "Luxury Black",
    price: 8,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383",
  },
  {
    id: 3,
    name: "Romantic Red",
    price: 6,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8",
  },
];

const GiftOptions = ({ item, updateItem }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";
  const selectCover = (cover) => {
    updateItem(item.cartItemId, {
      gift: {
        ...item.gift,
        coverId: cover.id,
        coverPrice: cover.price,
      },
    });
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">{t("Gift Wrapping")}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {covers.map((cover) => (
          <button
            key={cover.id}
            onClick={() => selectCover(cover)}
            className="border rounded-2xl overflow-hidden
            hover:shadow-lg transition text-left"
          >
            <img
              src={cover.image}
              alt=""
              className="h-40 w-full object-cover"
            />

            <div className="p-3">
              <h4 className="font-semibold">{cover.name}</h4>

              <p className="text-primary font-medium mt-1">+${cover.price}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="font-medium block mb-2">{t("Gift Message")}</label>

        <textarea
          rows={4}
          placeholder={t("greetingMessagePlaceholder")}
          className="w-full rounded-2xl border p-4 resize-none
          focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) =>
            updateItem(item.cartItemId, {
              gift: {
                ...item.gift,
                message: e.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default GiftOptions;
