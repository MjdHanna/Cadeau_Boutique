import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Suspense,
  memo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useRedeemGiftCardMutation,
  useGetReceivedGiftCardByIdQuery,
  useGetProductByIdQuery,
} from "../../redux/features/apiSlice";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import { selectToken } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";

const GiftProductCard = memo(
  ({
    productId,
    selected,
    toggleProduct,
    handleVariantSelect,
    updateQuantity,
    onProductLoaded,
  }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    const { data: productData, isLoading } = useGetProductByIdQuery(productId);
    const product = productData?.data;
    useEffect(() => {
      if (product) {
        onProductLoaded(product);
      }
    }, [product, onProductLoaded]);
    if (isLoading) {
      return (
        <div className="bg-gray-100 animate-pulse border-2 border-gray-100 rounded-3xl h-[450px] w-full shadow-sm"></div>
      );
    }

    if (!product) return null;

    const isSelected = !!selected;
    const name = isRTL ? product.productNameArabic : product.productNameEnglish;
    const description = isRTL
      ? product.productDescriptionArabic
      : product.productDescriptionEnglish;
    const brandName = isRTL
      ? product.brandNameArabic
      : product.brandNameEnglish;
    const categoryName = isRTL
      ? product.categoryNameArabic
      : product.categoryNameEnglish;
    const images =
      product.images ||
      (product.productImage ? [product.productImage] : []) ||
      [];
    const mainImage = images[0] || "https://via.placeholder.com/400";
    const variants = product.variants || [];
    const features = isRTL ? product.featuresArabic : product.featuresEnglish;

    const displayVariant = variants.find(
      (v) => String(v.variantId) === String(selected?.variantId),
    );
    const displayPrice = displayVariant
      ? displayVariant.variantPrice
      : product.price || (variants.length > 0 ? variants[0].variantPrice : 0);

    return (
      <motion.div
        whileHover={{ y: -6 }}
        className={`group relative bg-white border-2 rounded-3xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? "border-primary shadow-xl ring-4 ring-primary/10"
            : "border-gray-100 hover:border-gray-300 hover:shadow-lg"
        }`}
      >
        {isSelected && (
          <div className="absolute top-4 right-4 z-20 bg-primary text-white rounded-full p-1.5 shadow-md">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        <div
          className="relative h-64 w-full bg-gray-50 overflow-hidden cursor-pointer"
          onClick={() => toggleProduct(product, !isSelected)}
        >
          <img
            src={mainImage}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {brandName && (
              <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm w-fit">
                {brandName}
              </span>
            )}
            {categoryName && (
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm w-fit">
                {categoryName}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div
            className="flex justify-between items-start gap-4 mb-2 cursor-pointer"
            onClick={() => toggleProduct(product, !isSelected)}
          >
            <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-tight flex-1">
              {name}
            </h3>
            <p className="font-black text-2xl text-primary">
              ${Number(displayPrice).toFixed(2)}
            </p>
          </div>

          {description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {features && Object.keys(features).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(features)
                .slice(0, 3)
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-gray-50 border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {key}: {value}
                  </span>
                ))}
            </div>
          )}

          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-5 border-t border-gray-100 overflow-hidden"
              >
                {variants.length > 1 && (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">
                      {t("Select Option")}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => {
                        const isVariantSelected =
                          String(selected?.variantId) === String(v.variantId);
                        const attrName = Object.values(
                          isRTL ? v.attributesAr || {} : v.attributesEn || {},
                        ).join(" ");
                        return (
                          <button
                            key={v.variantId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(
                                product.productId,
                                v.variantId,
                              );
                            }}
                            className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${
                              isVariantSelected
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {attrName || v.variantSku}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.productId, selected.quantity - 1);
                    }}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-xl font-black text-gray-600 transition"
                  >
                    -
                  </button>
                  <span className="font-black text-lg text-gray-800">
                    {selected.quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.productId, selected.quantity + 1);
                    }}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-xl font-black text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSelected && (
            <button
              onClick={() => toggleProduct(product, true)}
              className="w-full mt-4 py-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white text-primary font-bold transition-colors"
            >
              {t("Select This Item")}
            </button>
          )}
        </div>
      </motion.div>
    );
  },
);

const RedeemGiftCard = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: cardData,
    isLoading: isFetchingCard,
    error: fetchError,
  } = useGetReceivedGiftCardByIdQuery(id);

  const [redeemGiftCard, { isLoading: isRedeeming }] =
    useRedeemGiftCardMutation();
  const giftCard = useMemo(() => cardData?.data, [cardData]);
  const [productsMap, setProductsMap] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  // State لتخزين تاريخ التوصيل (القيمة الافتراضية هي تاريخ اليوم)
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    if (!giftCard) return;
    setSelectedItems([]);
  }, [giftCard]);

  const availableProductIds = useMemo(() => {
    if (!giftCard) return [];
    const ids = new Set();
    if (giftCard.giftItems)
      giftCard.giftItems.forEach((p) => p.productId && ids.add(p.productId));
    if (giftCard.products)
      giftCard.products.forEach((p) => p.productId && ids.add(p.productId));
    if (giftCard.brands) {
      giftCard.brands.forEach((brand) => {
        if (brand.products)
          brand.products.forEach((p) => p.productId && ids.add(p.productId));
      });
    }
    return Array.from(ids);
  }, [giftCard]);

  const budget = Number(giftCard?.budget || 0);
  const handleProductLoaded = useCallback((product) => {
    setProductsMap((prev) => {
      if (prev[product.productId]) return prev;
      return { ...prev, [product.productId]: product };
    });
  }, []);

  const totalSelectedPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const product = productsMap[item.productId];
      if (!product) return sum;

      const variants = product.variants || [];
      const selectedVariant = variants.find(
        (v) => String(v.variantId) === String(item.variantId),
      );

      const variantPrice = selectedVariant?.variantPrice
        ? Number(selectedVariant.variantPrice)
        : variants.length === 1
          ? Number(variants[0].variantPrice)
          : Number(product.price || 0);

      return sum + variantPrice * Number(item.quantity);
    }, 0);
  }, [selectedItems, productsMap]);

  const selectedMap = useMemo(() => {
    return new Map(selectedItems.map((item) => [String(item.productId), item]));
  }, [selectedItems]);

  const canRedeem = useMemo(() => {
    if (!selectedItems.length) return false;
    if (!deliveryDate) return false; // يجب اختيار التاريخ

    const hasMissingVariant = selectedItems.some((item) => {
      const product = productsMap[item.productId];
      if (!product) return true;
      const variants = product.variants || [];
      return (
        variants.length > 1 && (!item.variantId || item.variantId === "null")
      );
    });

    if (hasMissingVariant) return false;
    if (totalSelectedPrice > budget) return false;

    return true;
  }, [selectedItems, totalSelectedPrice, budget, productsMap, deliveryDate]);

  const handleVariantSelect = useCallback((productId, variantId) => {
    setSelectedItems((prev) => {
      const exists = prev.find(
        (p) => String(p.productId) === String(productId),
      );
      if (exists) {
        return prev.map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, variantId: String(variantId) }
            : item,
        );
      } else {
        return [
          ...prev,
          {
            productId: String(productId),
            variantId: String(variantId),
            quantity: 1,
          },
        ];
      }
    });
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

  const toggleProduct = useCallback((product, checked) => {
    setSelectedItems((prev) => {
      if (checked) {
        const exists = prev.find(
          (p) => String(p.productId) === String(product.productId),
        );
        if (exists) return prev;

        const variants = product.variants || [];
        return [
          ...prev,
          {
            productId: String(product.productId),
            variantId:
              variants.length === 1 ? String(variants[0].variantId) : null,
            quantity: 1,
          },
        ];
      }
      return prev.filter(
        (p) => String(p.productId) !== String(product.productId),
      );
    });
  }, []);

  const handleRedeem = useCallback(async () => {
    if (!canRedeem) return;
    const giftCode = giftCard?.giftCode || giftCard?.code;
    if (!giftCode) {
      toast.error(t("Gift code is missing"));
      return;
    }

    try {
      const payload = {
        id,
        giftCode: giftCode,
        deliveryDate: deliveryDate, // تمرير التاريخ المختار من قبل المستخدم
        items: selectedItems.map((item) => {
          const payloadItem = {
            productId: Number(item.productId),
            quantity: Number(item.quantity),
          };
          if (item.variantId && item.variantId !== "null") {
            payloadItem.variantId = Number(item.variantId);
          }
          return payloadItem;
        }),
      };

      const response = await redeemGiftCard(payload).unwrap();

      toast.success(t("Gift card redeemed successfully 🎉"));
      const orderId =
        response?.data?.orderId || response?.orderId || response?.id;
      navigate(orderId ? `/orders?highlight=${orderId}` : "/orders");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to redeem gift card"));
    }
  }, [
    id,
    giftCard,
    selectedItems,
    canRedeem,
    redeemGiftCard,
    navigate,
    t,
    deliveryDate,
  ]);

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

  if (isFetchingCard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-gray-500 font-bold">
          {t("Loading gift card details...")}
        </p>
      </div>
    );
  }

  if (fetchError || !giftCard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
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
        <p className="text-red-500 font-bold text-xl">
          {t("Gift card not found or already redeemed")}
        </p>
      </div>
    );
  }

  // الحصول على تاريخ اليوم لتعيينه كحد أدنى (لمنع اختيار تواريخ سابقة)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-12 md:py-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-black text-gray-900">
          {t("Redeem Your Gift")}
        </h1>
        <p className="text-gray-500 mt-2">
          {t("Choose your favorite products from the gifted brands!")}
        </p>
        <div className="mt-4 h-1.5 w-24 mx-auto bg-primary rounded-full" />
      </motion.div>
      {(giftCard.sender || giftCard.giftCardMessage) && (
        <div className="mb-10 p-6 bg-yellow-50 rounded-3xl border border-yellow-100 flex flex-col items-center text-center shadow-sm">
          {giftCard.sender && (
            <div className="flex flex-col items-center mb-4">
              <img
                src={giftCard.sender.senderProfileImg || "/default-avatar.png"}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm mb-2 bg-white"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <p className="text-sm text-yellow-600 font-bold">
                {t("Gift from")}
              </p>
              <p className="text-xl font-black text-gray-800">
                {giftCard.sender.senderName}
              </p>
            </div>
          )}
          {giftCard.giftCardMessage && (
            <>
              {giftCard.sender && (
                <div className="w-12 h-px bg-yellow-200 mb-4"></div>
              )}
              <p className="text-yellow-800 font-medium italic text-xl leading-relaxed">
                "{giftCard.giftCardMessage}"
              </p>
            </>
          )}
        </div>
      )}
      <div className="bg-white rounded-3xl p-6 mb-10 shadow-sm border border-gray-100">
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
            className={`rounded-2xl p-5 border text-center transition-colors ${
              budget - totalSelectedPrice >= 0
                ? "bg-green-50 border-green-100"
                : "bg-red-50 border-red-100"
            }`}
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
      {availableProductIds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {availableProductIds.map((productId) => (
            <GiftProductCard
              key={productId}
              productId={productId}
              selected={selectedMap.get(String(productId))}
              toggleProduct={toggleProduct}
              handleVariantSelect={handleVariantSelect}
              updateQuantity={updateQuantity}
              onProductLoaded={handleProductLoaded}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 mb-12">
          <p className="text-gray-500 font-medium text-lg">
            {t("No products found for this gift card.")}
          </p>
        </div>
      )}

      {totalSelectedPrice > budget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center font-bold flex items-center justify-center gap-2"
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
            "The selected products exceed the gift card budget. Please choose cheaper options or reduce quantities.",
          )}
        </motion.div>
      )}

      {/* حقل اختيار تاريخ التوصيل الأنيق */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="text-center sm:text-start">
          <h3 className="text-xl font-black text-gray-800">
            {t("Delivery Date")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {t("When would you like to receive your gift?")}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="date"
            min={today}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border-2 border-gray-200 text-gray-800 text-lg font-bold rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
          />
        </div>
      </motion.div>

      <button
        onClick={handleRedeem}
        disabled={isRedeeming || !canRedeem}
        className={`w-full py-5 rounded-3xl text-white font-black text-xl transition-all shadow-md ${
          isRedeeming || !canRedeem
            ? "bg-gray-300 cursor-not-allowed shadow-none"
            : "bg-primary hover:bg-primary/90 hover:-translate-y-1 hover:shadow-xl"
        }`}
      >
        {isRedeeming ? (
          <span className="flex justify-center items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            {t("Processing...")}
          </span>
        ) : (
          `✨ ${t("Confirm & Redeem Gift")}`
        )}
      </button>
    </div>
  );
};

export default RedeemGiftCard;
