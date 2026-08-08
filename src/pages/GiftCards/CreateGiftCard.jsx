import { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import { selectTranslate } from "../../redux/features/translateSlice";

import {
  useGetFriendsQuery,
  useGetProductsQuery,
  useCreateGiftCardMutation,
} from "../../redux/features/apiSlice";
import LoginRequired from "../../components/LoginRequired/LoginRequired";

const MuiTextField = lazy(
  () => import("../../components/form/MuiTextField/MuiTextField"),
);

const CreateGiftCard = () => {
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";
  const token = useSelector(selectToken);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [receiverId, setReceiverId] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: friendsData } = useGetFriendsQuery();
  const { data: productsData } = useGetProductsQuery();

  const [createGiftCard, { isLoading }] = useCreateGiftCardMutation();

  const products = useMemo(() => productsData?.data ?? [], [productsData]);

  const toggleProduct = useCallback((product) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.productId === product.productId);
      if (exists) {
        return prev.filter((item) => item.productId !== product.productId);
      }
      return [...prev, { productId: product.productId, quantity: 1, product }];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const validQuantity = Math.max(1, Number(quantity));
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === id ? { ...item, quantity: validQuantity } : item,
      ),
    );
  }, []);

  const removeProduct = useCallback((id) => {
    setSelectedItems((prev) => prev.filter((item) => item.productId !== id));
  }, []);

  const selectedIds = useMemo(
    () => new Set(selectedItems.map((i) => i.productId)),
    [selectedItems],
  );

  const handleSubmit = useCallback(async () => {
    if (!receiverId || !budget || selectedItems.length === 0) {
      toast.warning(
        t("Please fill all required fields and select at least one product"),
      );
      return;
    }

    try {
      await createGiftCard({
        receiverId: Number(receiverId),
        budget: Number(budget),
        recipientType: "friend", // تمت الإضافة حسب الـ API
        message,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      }).unwrap();

      toast.success(t("Gift card sent successfully 🎉"));
      navigate("/gift-cards/sent");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to create gift card"));
    }
  }, [receiverId, budget, message, selectedItems, createGiftCard, navigate, t]);

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

  return (
    <div
      className="max-w-7xl mx-auto px-4 py-12 md:py-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-black text-gray-900">
          {t("Create Gift Card")}
        </h1>
        <p className="text-gray-500 mt-2">
          {t("Choose products and send a special gift card to your friend")}
        </p>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 px-4 py-4 mb-5 focus:ring-2 focus:ring-primary outline-none transition-all"
        >
          <option value="" disabled>
            {t("Select Friend")}
          </option>
          {friendsData?.data?.map((friend) => (
            <option key={friend.id} value={friend.id}>
              {friend.userName}
            </option>
          ))}
        </select>

        <Suspense
          fallback={
            <div className="h-14 bg-gray-100 animate-pulse rounded-xl mb-4"></div>
          }
        >
          <MuiTextField
            type="number"
            label={t("Budget")}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Suspense>

        <div className="mt-4">
          <Suspense
            fallback={
              <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
            }
          >
            <MuiTextField
              multiline
              rows={4}
              label={t("Write a message (Optional)")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Suspense>
        </div>
      </div>

      {/* منطقة المنتجات */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">{t("Products")}</h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {products.length} {t("Items")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {products.map((product) => {
          const isSelected = selectedIds.has(product.productId);
          return (
            <div
              key={product.productId}
              className={`bg-white border-2 rounded-3xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? "border-primary shadow-md"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <img
                src={product.productImage}
                alt="Product"
                className="h-56 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="font-semibold line-clamp-2 text-gray-800 h-12">
                  {lang === "ar"
                    ? product.productNameArabic
                    : product.productNameEnglish}
                </h3>
                <p className="text-2xl font-black text-primary mt-2">
                  ${product.productPrice}
                </p>
                <button
                  onClick={() => toggleProduct(product)}
                  className={`w-full mt-4 py-3 rounded-xl font-bold transition-colors ${
                    isSelected
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {isSelected ? t("Remove from Gift") : t("Add to Gift")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* المنتجات المختارة */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-3xl border border-gray-200 p-6 mb-10"
        >
          <h2 className="text-xl font-black mb-6">{t("Selected Products")}</h2>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.product.productImage}
                    className="w-16 h-16 rounded-lg object-cover"
                    alt=""
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">
                      {lang === "ar"
                        ? item.product.productNameArabic
                        : item.product.productNameEnglish}
                    </h3>
                    <p className="text-primary font-bold">
                      ${item.product.productPrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, e.target.value)
                      }
                      className="w-12 text-center py-2 outline-none border-x border-gray-200 font-medium"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeProduct(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || selectedItems.length === 0}
        className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {t("Processing...")}
          </span>
        ) : (
          `🎁 ${t("Send Gift Card")}`
        )}
      </button>
    </div>
  );
};

export default CreateGiftCard;
