import { lazy, Suspense, useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { useGetReceivedGiftCardsQuery } from "../../redux/features/apiSlice";

import GiftCardEmpty from "../../components/giftCards/GiftCardEmpty";
import GiftCardSkeleton from "../../components/giftCards/GiftCardSkeleton";
import Loader from "../../views/Loader/Loader";
import { selectToken } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import LoginRequired from "../../components/LoginRequired/LoginRequired";

const GiftCardCard = lazy(
  () => import("../../components/giftCards/giftCardCard"),
);

const ITEMS_PER_PAGE = 6;

const ReceivedGiftCards = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetReceivedGiftCardsQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const cards = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((card) => card.status !== "redeemed")
      .map((card) => ({
        id: card.id,
        message: card.giftCardMessage,
        budget: Number(card.budget),
        status: card.status,

        sender: {
          id: card.sender?.senderId,
          name: card.sender?.senderName,
          image: card.sender?.senderProfileImg,
        },

        items: (card.giftItems ?? []).map((item) => ({
          productId: item.productId,
          quantity: Number(item.GiftProductQuantity || 0),

          nameEn: item.productNameEn,
          nameAr: item.productNameAr,

          descriptionEn: item.productDescriptionEn,
          descriptionAr: item.productDescriptionAr,

          image: item.productImg,

          variants: (item.productVariants ?? []).map((v) => ({
            variantId: v.variantId,
            price: Number(v.variantPrice),
            stock: Number(v.variantStockQuantity),

            attributesEn: v.variantAttributesEn ?? {},
            attributesAr: v.variantAttributesAr ?? {},
          })),
        })),
      }));
  }, [data]);

  const totalPages = useMemo(
    () => Math.ceil(cards.length / ITEMS_PER_PAGE),
    [cards.length],
  );

  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return cards.slice(start, start + ITEMS_PER_PAGE);
  }, [cards, currentPage]);

  const handlePrev = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!token) {
    return (
      <Suspense fallback={<div className="text-center py-28">Loading...</div>}>
        <LoginRequired
          message={t("Please login")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }
  if (error) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <p className="text-red-500 font-medium">
          {t("Failed to load received gift cards")}
        </p>
      </div>
    );
  }

  if (!cards.length) {
    return <GiftCardEmpty create />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-10 md:mb-14">
        <h1
          className={`
            text-3xl md:text-4xl font-extrabold
            text-gray-900
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {t("Received Gift Cards")}
        </h1>

        <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/30" />

        <p className="text-gray-500 mt-3">
          {t("All gift cards you received from friends")}
        </p>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <GiftCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            md:gap-8
          "
        >
          {paginatedCards.map((card) => (
            <GiftCardCard key={card.id} card={card} received />
          ))}
        </div>
      </Suspense>
      {totalPages > 1 && (
        <div className="mt-14 flex justify-center items-center gap-5">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="
              w-12 h-12 rounded-xl
              border border-gray-200
              bg-gray-100
              hover:bg-gray-200
              disabled:opacity-40
              transition
            "
          >
            ◀
          </button>

          <div className="px-5 py-2 rounded-xl border bg-white shadow-sm font-medium">
            {t("Page")} {currentPage} {t("of")} {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="
              w-12 h-12 rounded-xl
              border border-gray-200
              bg-gray-100
              hover:bg-gray-200
              disabled:opacity-40
              transition
            "
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceivedGiftCards;
