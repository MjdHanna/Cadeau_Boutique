import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

    console.log(
      "GIFT ITEMS",
      giftCard.giftItems.map((item) => ({
        productId: item.productId,
        variants: item.productVariants,
      })),
    );

    const mapped = giftCard.giftItems.map((item) => ({
      productId: String(item.productId),
      variantId:
        item.productVariants?.length > 0
          ? String(item.productVariants[0].variantId)
          : null,
      quantity: Number(item.GiftProductQuantity ?? 1),
      nameEn: item.productNameEn,
      nameAr: item.productNameAr,
      image: item.productImg,
      variants: item.productVariants ?? [],
    }));

    console.log("MAPPED", mapped);

    setSelectedItems([]);
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
    const map = new Map();
    selectedItems.forEach((item) => {
      map.set(String(item.productId), item);
    });
    return map;
  }, [selectedItems]);

  const canRedeem = useMemo(() => {
    if (!selectedItems.length) {
      return false;
    }

    const hasMissingVariant = selectedItems.some((item) => {
      const product = giftCard?.giftItems?.find(
        (p) => String(p.productId) === String(item.productId),
      );

      const variantsCount = product?.productVariants?.length || 0;

      console.log("CHECK ITEM", {
        productId: item.productId,
        variantId: item.variantId,
        variantsCount,
      });

      return !item.variantId;
    });

    if (hasMissingVariant) {
      return false;
    }

    console.log("budget =", budget, "totalSelectedPrice =", totalSelectedPrice);

    if (totalSelectedPrice > budget) {
      return false;
    }

    return true;
  }, [selectedItems, totalSelectedPrice, budget, giftCard]);

  const updateVariant = useCallback((productId, variantId) => {
    console.log("UPDATE VARIANT", {
      productId,
      variantId,
    });

    setSelectedItems((prev) => {
      const updated = prev.map((item) =>
        String(item.productId) === String(productId)
          ? {
              ...item,
              variantId: variantId ? String(variantId) : null,
            }
          : item,
      );

      console.log("AFTER UPDATE", updated);

      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const targetProductId = String(productId);
    const newQty = Math.max(1, Number(quantity));
    setSelectedItems((prev) =>
      prev.map((item) =>
        String(item.productId) === targetProductId
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
              item.productVariants?.length > 0
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
    const hasMissingVariant = selectedItems.some(
      (item) => !item.variantId || item.variantId === "null",
    );

    if (hasMissingVariant) {
      toast.warning(t("Please select all product variants"));
      return;
    }

    if (totalSelectedPrice > budget) {
      toast.warning(
        t("Selected products exceed the available gift card budget"),
      );
      return;
    }

    try {
      const response = await redeemGiftCard({
        id,
        items: selectedItems.map((item) => ({
          productId: Number(item.productId),
          variantId: Number(item.variantId),
          quantity: Number(item.quantity),
        })),
      }).unwrap();

      toast.success(t("Gift card redeemed successfully"));

      const orderId =
        response?.data?.orderId || response?.orderId || response?.id;

      navigate(orderId ? `/orders?highlight=${orderId}` : "/orders");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to redeem gift card"));
    }
  }, [
    id,
    selectedItems,
    redeemGiftCard,
    navigate,
    t,
    totalSelectedPrice,
    budget,
  ]);

  if (!giftCard) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-red-500 font-bold">{t("No gift card found")}</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-24" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-black">{t("Redeem Gift Card")}</h1>
        <div className="mt-3 h-1 w-24 mx-auto bg-green-500 rounded-full" />
        <p className="text-gray-500 mt-3">
          {t("Choose your products and complete your order")}
        </p>
      </motion.div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-10 shadow-sm">
        <h2 className="text-xl font-bold mb-2">{t("Gift Message")}</h2>
        <p className="text-gray-600">{giftCard.giftCardMessage}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
            <p className="text-sm text-gray-500">{t("Budget")}</p>
            <p className="text-2xl font-black text-primary">
              ${budget.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-sm text-gray-500">{t("Selected")}</p>
            <p className="text-2xl font-black text-green-600">
              ${totalSelectedPrice.toFixed(2)}
            </p>
          </div>
          <div
            className={`rounded-2xl p-5 border ${budget - totalSelectedPrice >= 0 ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"}`}
          >
            <p className="text-sm text-gray-500">{t("Remaining")}</p>
            <p
              className={`text-2xl font-black ${budget - totalSelectedPrice >= 0 ? "text-blue-600" : "text-red-600"}`}
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
              whileHover={{ y: -3 }}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <img
                src={item.productImg}
                className="w-full h-56 object-cover"
                alt=""
              />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={(e) => toggleProduct(item, e.target.checked)}
                    className="w-5 h-5"
                  />

                  <span className="font-semibold">{t("Select Product")}</span>
                </div>
                <h3 className="font-bold text-lg">
                  {isRTL ? item.productNameAr : item.productNameEn}
                </h3>
                {selected && item.productVariants?.length > 1 && (
                  <select
                    value={selected?.variantId || ""}
                    className="w-full mt-4 border rounded-xl p-3"
                    onChange={(e) =>
                      updateVariant(String(item.productId), e.target.value)
                    }
                  >
                    <option value="">{t("Select Variant")}</option>
                    {item.productVariants?.map((v) => {
                      console.log("VARIANT", v);

                      return (
                        <option key={v.variantId} value={String(v.variantId)}>
                          {Object.values(
                            isRTL
                              ? v.variantAttributesAr
                              : v.variantAttributesEn,
                          ).join(" - ")}
                          {" - "}${Number(v.variantPrice).toFixed(2)}
                        </option>
                      );
                    })}
                  </select>
                )}
                {selected && (
                  <input
                    type="number"
                    min="1"
                    value={selected?.quantity ?? 1}
                    onChange={(e) =>
                      updateQuantity(String(item.productId), e.target.value)
                    }
                    className="w-full mt-4 border rounded-xl p-3 text-center"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalSelectedPrice > budget && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center font-medium">
          {t(
            "The selected products exceed the gift card budget. Please choose cheaper options.",
          )}
        </div>
      )}

      {selectedItems.length > 0 &&
        selectedItems.some((item) => !item.variantId) && (
          <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-center font-medium">
            {t("Please choose a variant for every product")}
          </div>
        )}
      <button
        onClick={handleRedeem}
        disabled={isLoading || !canRedeem}
        className={`w-full py-5 rounded-3xl text-white font-bold text-lg transition ${
          isLoading || !canRedeem
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:scale-[1.01]"
        }`}
      >
        {isLoading ? t("Redeeming...") : ` ${t("Redeem Gift")}`}
      </button>
    </div>
  );
};
export default RedeemGiftCard;
