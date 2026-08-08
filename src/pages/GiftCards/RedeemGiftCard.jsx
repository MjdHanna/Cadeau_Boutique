import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useRedeemGiftCardMutation,
  useGetReceivedGiftCardsQuery,
} from "../../redux/features/apiSlice";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import { selectToken } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";

const RedeemGiftCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: receivedCards } = useGetReceivedGiftCardsQuery();
  const [redeemGiftCard, { isLoading }] = useRedeemGiftCardMutation();

  const giftCard = useMemo(() => {
    return receivedCards?.data?.find((card) => String(card.id) === String(id));
  }, [receivedCards, id]);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!giftCard?.giftItems) return;
    setSelectedItems([]); // إعادة الضبط عند تغيير البطاقة
  }, [giftCard]);

  const budget = Number(giftCard?.budget || 0);

  const totalSelectedPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const giftItem = giftCard?.giftItems?.find(
        (p) => String(p.productId) === String(item.productId),
      );
      const selectedVariant = giftItem?.productVariants?.find(
        (v) => String(v.variantId) === String(item.variantId),
      );

      const variantPrice = selectedVariant?.variantPrice
        ? Number(selectedVariant.variantPrice)
        : giftItem?.productVariants?.length === 1
          ? Number(giftItem.productVariants[0].variantPrice)
          : 0;

      return sum + variantPrice * Number(item.quantity);
    }, 0);
  }, [selectedItems, giftCard]);

  const selectedMap = useMemo(() => {
    return new Map(selectedItems.map((item) => [String(item.productId), item]));
  }, [selectedItems]);

  const canRedeem = useMemo(() => {
    if (!selectedItems.length) return false;
    const hasMissingVariant = selectedItems.some((item) => {
      const product = giftCard?.giftItems?.find(
        (p) => String(p.productId) === String(item.productId),
      );
      const variantsCount = product?.productVariants?.length || 0;
      return variantsCount > 1 && !item.variantId;
    });

    if (hasMissingVariant) return false;
    if (totalSelectedPrice > budget) return false;

    return true;
  }, [selectedItems, totalSelectedPrice, budget, giftCard]);

  const updateVariant = useCallback((productId, variantId) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, variantId: variantId ? String(variantId) : null }
          : item,
      ),
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const newQty = Math.max(1, Number(quantity));
    setSelectedItems((prev) =>
      prev.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, quantity: newQty }
          : item,
      ),
    );
  }, []);

  const toggleProduct = useCallback((item, checked) => {
    setSelectedItems((prev) => {
      if (checked) {
        const exists = prev.find(
          (p) => String(p.productId) === String(item.productId),
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            productId: String(item.productId),
            variantId:
              item.productVariants?.length === 1
                ? String(item.productVariants[0].variantId)
                : null,
            quantity: Number(item.GiftProductQuantity ?? 1),
          },
        ];
      }
      return prev.filter((p) => String(p.productId) !== String(item.productId));
    });
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!canRedeem) return;

    try {
      const response = await redeemGiftCard({
        id,
        giftCode: giftCard?.giftCode, // إضافة الكود ليتناسب مع الـ API
        items: selectedItems.map((item) => ({
          productId: Number(item.productId),
          variantId: Number(item.variantId),
          quantity: Number(item.quantity),
        })),
      }).unwrap();

      toast.success(t("Gift card redeemed successfully 🎉"));
      const orderId =
        response?.data?.orderId || response?.orderId || response?.id;
      navigate(orderId ? `/orders?highlight=${orderId}` : "/orders");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to redeem gift card"));
    }
  }, [id, giftCard, selectedItems, canRedeem, redeemGiftCard, navigate, t]);

  if (!token) {
    return (
      <Suspense
        fallback={<div className="text-center py-28">{t("Loading...")}</div>}
      >
        <LoginRequired
          message={t("Please login")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  if (!giftCard) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
        <svg
          className="w-16 h-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 font-bold text-xl">
          {t("Gift card not found or already redeemed")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-12 md:py-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-black text-gray-900">
          {t("Redeem Your Gift")}
        </h1>
        <div className="mt-4 h-1.5 w-24 mx-auto bg-primary rounded-full" />
      </motion.div>

      <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm border border-gray-100">
        {giftCard.giftCardMessage && (
          <div className="mb-8 p-5 bg-yellow-50 rounded-2xl border border-yellow-100">
            <p className="text-yellow-800 font-medium italic">
              "{giftCard.giftCardMessage}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">
              {t("Available Budget")}
            </p>
            <p className="text-3xl font-black text-gray-800">
              ${budget.toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 text-center">
            <p className="text-sm text-blue-500 mb-1">{t("Selected Total")}</p>
            <p className="text-3xl font-black text-blue-700">
              ${totalSelectedPrice.toFixed(2)}
            </p>
          </div>
          <div
            className={`rounded-2xl p-5 border text-center transition-colors ${budget - totalSelectedPrice >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
          >
            <p
              className={`text-sm mb-1 ${budget - totalSelectedPrice >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {t("Remaining Balance")}
            </p>
            <p
              className={`text-3xl font-black ${budget - totalSelectedPrice >= 0 ? "text-green-700" : "text-red-600"}`}
            >
              ${(budget - totalSelectedPrice).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {giftCard.giftItems?.map((item) => {
          const selected = selectedMap.get(String(item.productId));
          return (
            <motion.div
              key={item.productId}
              whileHover={{ y: -4 }}
              className={`bg-white border-2 rounded-3xl overflow-hidden transition-all ${selected ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-200"}`}
            >
              <img
                src={item.productImg}
                className="w-full h-56 object-cover"
                alt=""
                loading="lazy"
              />
              <div className="p-5">
                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={(e) => toggleProduct(item, e.target.checked)}
                    className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <span className="font-bold text-gray-700">
                    {t("Select This Item")}
                  </span>
                </label>

                <h3 className="font-bold text-lg h-14 line-clamp-2">
                  {isRTL ? item.productNameAr : item.productNameEn}
                </h3>

                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3 overflow-hidden"
                    >
                      {item.productVariants?.length > 1 && (
                        <select
                          value={selected?.variantId || ""}
                          onChange={(e) =>
                            updateVariant(
                              String(item.productId),
                              e.target.value,
                            )
                          }
                          className="w-full border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="" disabled>
                            {t("Select Variant")}
                          </option>
                          {item.productVariants.map((v) => (
                            <option
                              key={v.variantId}
                              value={String(v.variantId)}
                            >
                              {Object.values(
                                isRTL
                                  ? v.variantAttributesAr
                                  : v.variantAttributesEn,
                              ).join(" - ")}{" "}
                              - ${Number(v.variantPrice).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              selected.quantity - 1,
                            )
                          }
                          className="px-4 py-2 hover:bg-gray-200 rounded-lg font-bold text-gray-600"
                        >
                          -
                        </button>
                        <span className="font-bold">{selected.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              selected.quantity + 1,
                            )
                          }
                          className="px-4 py-2 hover:bg-gray-200 rounded-lg font-bold text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalSelectedPrice > budget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center font-bold flex items-center justify-center gap-3"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {t(
            "The selected products exceed the gift card budget. Please adjust your selection.",
          )}
        </motion.div>
      )}

      <button
        onClick={handleRedeem}
        disabled={isLoading || !canRedeem}
        className={`w-full py-5 rounded-2xl text-white font-black text-xl transition-all shadow-md ${
          isLoading || !canRedeem
            ? "bg-gray-300 cursor-not-allowed shadow-none"
            : "bg-primary hover:bg-primary/90 hover:-translate-y-1"
        }`}
      >
        {isLoading ? t("Processing...") : `✨ ${t("Confirm & Redeem Gift")}`}
      </button>
    </div>
  );
};
export default RedeemGiftCard;
