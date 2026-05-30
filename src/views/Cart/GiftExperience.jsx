import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipientSelector from "./RecipientSelector";
import { useTranslation } from "react-i18next";
import { useGetGiftWrappersQuery } from "../../redux/features/apiSlice";

const GiftExperience = ({ giftData, setGiftData }) => {
  const { t, i18n } = useTranslation();
  const { data: wrappersData } = useGetGiftWrappersQuery();

  const covers = wrappersData?.data || [];
  const isRTL = i18n.language === "ar";
  return (
    <motion.div
      layout
      className="
        bg-white
        rounded-[36px]
        p-7
        shadow-[0_10px_40px_rgba(0,0,0,0.04)]
        border border-gray-100
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                w-14 h-14
                rounded-2xl
                bg-primary/10
                flex items-center justify-center
                text-2xl
              "
            >
              🎁
            </div>

            <div>
              <h2 className="text-3xl font-black">{t("Gift Experience")}</h2>

              <p className="text-gray-500 mt-1">
                {t("Turn your order into a luxury gift")}
              </p>
            </div>
          </div>
        </div>

        {/* TOGGLE */}

        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={giftData.enabled}
            onChange={() =>
              setGiftData((prev) => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
          />

          <div
            className="
              w-16 h-9
              bg-gray-200
              rounded-full
              peer-checked:bg-primary
              transition
              relative
            "
          >
            <span
              className="
                absolute top-1 left-1
                w-7 h-7
                rounded-full
                bg-white
                transition
                peer-checked:translate-x-7
              "
            />
          </div>
        </label>
      </div>

      {/* OPTIONAL GIFT EXPERIENCE */}

      <AnimatePresence>
        {giftData.enabled && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {/* WRAPPING */}

            <div className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-black">{t("Gift Wrapping")}</h3>

                  <p className="text-gray-500 mt-1">
                    {t("Choose premium wrapping style")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {covers.map((cover) => {
                  const selected = giftData.coverId === cover.id;

                  return (
                    <motion.button
                      whileHover={{
                        y: -4,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      key={cover.id}
                      onClick={() =>
                        setGiftData((prev) => ({
                          ...prev,
                          coverId: cover.id,
                          coverPrice: Number(cover.price) || 0,
                        }))
                      }
                      className={`
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border-2
                  bg-white
                  transition-all
                  text-left
                  ${selected ? "border-primary shadow-xl" : "border-gray-100"}
                `}
                    >
                      {selected && (
                        <div
                          className="
                      absolute top-4 right-4
                      z-10
                      w-8 h-8
                      rounded-full
                      bg-primary
                      text-white
                      flex items-center justify-center
                      font-black
                    "
                        >
                          ✓
                        </div>
                      )}

                      <img
                        src={cover.img}
                        alt={cover.name}
                        className="
                    h-64
                    w-full
                    object-cover
                  "
                      />

                      <div className="p-5">
                        <h4 className="font-black text-lg">{cover.name}</h4>

                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-2xl font-black text-primary">
                            ${cover.price}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* MESSAGE */}

            <div className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <label className="font-black text-2xl">
                  {t("Greeting Message")}
                </label>

                <span className="text-sm text-gray-400">
                  {giftData.message.length}/250
                </span>
              </div>

              <textarea
                rows={6}
                maxLength={250}
                placeholder={t("Write something beautiful...")}
                value={giftData.message}
                onChange={(e) =>
                  setGiftData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="
            w-full
            rounded-[30px]
            border border-gray-200
            bg-[#fafafa]
            p-6
            resize-none
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-primary
          "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REQUIRED SECTION */}

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="
        w-10 h-10
        rounded-xl
        bg-primary/10
        flex items-center justify-center
      "
          >
            📅
          </div>

          <div>
            <label className="font-black text-2xl block">
              {t("Delivery Date")}
            </label>

            <p className="text-gray-500 text-sm">
              {t("Required before completing order")}
            </p>
          </div>
        </div>

        <input
          type="date"
          value={giftData.deliveryDate}
          onChange={(e) =>
            setGiftData((prev) => ({
              ...prev,
              deliveryDate: e.target.value,
            }))
          }
          className="
      w-full
      rounded-[24px]
      border border-gray-200
      p-5
      text-lg
      focus:outline-none
      focus:ring-2
      focus:ring-primary
    "
        />
      </div>

      {/* REQUIRED RECIPIENT */}

      <div className="mt-12">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="
        w-10 h-10
        rounded-xl
        bg-primary/10
        flex items-center justify-center
      "
          >
            👤
          </div>

          <div>
            <h3 className="font-black text-2xl">
              {t("Recipient Information")}
            </h3>

            <p className="text-gray-500 text-sm">
              {t("Required before placing order")}
            </p>
          </div>
        </div>

        <RecipientSelector giftData={giftData} setGiftData={setGiftData} />
      </div>
    </motion.div>
  );
};

export default GiftExperience;
