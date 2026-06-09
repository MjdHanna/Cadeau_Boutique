import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  HiGift,
  HiOutlineArrowRight,
  HiOutlinePlusCircle,
  HiOutlineInbox,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  useGetReceivedGiftCardsQuery,
  useGetSentGiftCardsQuery,
} from "../../redux/features/apiSlice";

import { selectTranslate } from "../../redux/features/translateSlice";

const GiftCardSection = () => {
  const { t } = useTranslation();
  const lang = useSelector(selectTranslate);

  const { data: receivedData, isLoading: receivedLoading } =
    useGetReceivedGiftCardsQuery(undefined, {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    });

  const { data: sentData, isLoading: sentLoading } = useGetSentGiftCardsQuery(
    undefined,
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  );

  const receivedCount = useMemo(() => {
    if (!Array.isArray(receivedData?.data)) return 0;

    return receivedData.data.filter((card) => card.status !== "redeemed")
      .length;
  }, [receivedData]);

  const sentCount = useMemo(() => {
    if (!Array.isArray(sentData?.data)) return 0;

    return sentData.data.filter((card) => card.status !== "redeemed").length;
  }, [sentData]);

  const cards = useMemo(
    () => [
      {
        title: t("Sent Gift Cards"),
        count: sentCount,
        loading: sentLoading,
        icon: <HiOutlinePaperAirplane className="text-3xl text-primary" />,
        path: "/gift-cards/sent",
        create: false,
      },
      {
        title: t("Received Gift Cards"),
        count: receivedCount,
        loading: receivedLoading,
        icon: <HiOutlineInbox className="text-3xl text-emerald-600" />,
        path: "/gift-cards/received",
        create: false,
      },
      {
        title: t("Create Gift Card"),
        icon: <HiOutlinePlusCircle className="text-3xl text-amber-600" />,
        path: "/gift-cards/create",
        create: true,
      },
    ],
    [t, sentCount, receivedCount, sentLoading, receivedLoading],
  );

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-16
        lg:py-24
      "
    >
      <div className="text-center mb-14 lg:mb-20">
        <div
          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2.5
            rounded-full
            border
            border-primary/20
            bg-primary/5
            backdrop-blur-sm
            text-primary
            font-medium
          "
        >
          <HiGift className="text-lg" />
          {t("Gift Cards")}
        </div>

        <h2
          className="
            mt-6
            text-4xl
            md:text-5xl
            lg:text-6xl
            font-extrabold
            tracking-tight
            leading-tight
            text-gray-900
          "
        >
          {t("Share Happiness")}
        </h2>

        <p
          className="
            mt-5
            max-w-3xl
            mx-auto
            text-base
            md:text-lg
            leading-8
            text-gray-600
          "
        >
          {t(
            "Create personalized gift cards and send them to your friends and family.",
          )}
        </p>
      </div>
      <div
        className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-3
    gap-6
    lg:gap-8
  "
      >
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            aria-label={card.title}
            className="block h-full"
          >
            <motion.div
              whileHover={{
                y: -4,
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
          group
          h-full
          bg-white
          rounded-3xl
          border
          border-gray-100
          p-7
          lg:p-8
          shadow-sm
          hover:shadow-xl
          transition-all
          duration-300
        "
            >
              <div
                className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            ${
              card.create
                ? "bg-amber-50"
                : card.title === t("Received Gift Cards")
                  ? "bg-emerald-50"
                  : "bg-primary/10"
            }
          `}
              >
                {card.icon}
              </div>
              <h3
                className="
            mt-5
            text-xl
            font-bold
            text-gray-900
          "
              >
                {card.title}
              </h3>
              {!card.create ? (
                <div className="mt-4">
                  <span
                    className="
                inline-flex
                items-center
                px-3
                py-1.5
                rounded-full
                bg-gray-100
                text-gray-700
                text-sm
                font-medium
              "
                  >
                    {card.loading
                      ? t("Loading...")
                      : `${card.count} ${t("Cards")}`}
                  </span>
                </div>
              ) : (
                <p
                  className="
              mt-4
              text-gray-600
              leading-7
            "
                >
                  {t("Create and send a personalized gift card")}
                </p>
              )}
              <div
                className="
            mt-8
            flex
            items-center
            justify-between
          "
              >
                <span
                  className="
              text-sm
              font-semibold
              text-gray-800
            "
                >
                  {card.create ? t("Create Now") : t("View Details")}
                </span>

                <div
                  className="
              w-10
              h-10
              rounded-full
              bg-primary
              text-white
              flex
              items-center
              justify-center
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
                >
                  <HiOutlineArrowRight
                    className={lang === "ar" ? "rotate-180" : ""}
                  />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default memo(GiftCardSection);
