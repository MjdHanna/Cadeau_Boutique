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

  const addProduct = useCallback((product) => {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.productId === product.productId);
      if (exists) return prev;

      return [
        ...prev,
        {
          productId: product.productId,
          quantity: 1,
          product,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === id ? { ...item, quantity: Number(quantity) } : item,
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
      toast.error(t("Please fill all fields"));
      return;
    }

    try {
      await createGiftCard({
        receiverId: Number(receiverId),
        budget: Number(budget),
        message,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      }).unwrap();

      toast.success(t("Gift card sent successfully"));
      navigate("/gift-cards/sent");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to create gift card"));
    }
  }, [receiverId, budget, message, selectedItems, createGiftCard, navigate, t]);

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
        className="mb-10"
      >
        <h1 className="text-4xl font-black">{t("Create Gift Card")}</h1>

        <p className="text-gray-500 mt-2">
          {t("Choose products and send a special gift card to your friend")}
        </p>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="
            w-full
            rounded-2xl
            border border-gray-200
            px-4 py-4 mb-5
            focus:ring-2 focus:ring-primary
            outline-none
          "
        >
          <option value="">{t("Select Friend")}</option>

          {friendsData?.data?.map((friend) => (
            <option key={friend.id} value={friend.id}>
              {friend.userName}
            </option>
          ))}
        </select>

        <Suspense fallback={null}>
          <MuiTextField
            type="number"
            label={t("Budget")}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Suspense>

        <div className="mt-4">
          <Suspense fallback={null}>
            <MuiTextField
              multiline
              rows={5}
              label={t("Write a message")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Suspense>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black">{t("Products")}</h2>

        <span className="text-gray-500">
          {products.length} {t("Items")}
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          gap-6 md:gap-8
          mb-10
        "
      >
        {products.map((product) => {
          const isSelected = selectedIds.has(product.productId);

          return (
            <div
              key={product.productId}
              className="
                bg-white
                border border-gray-100
                rounded-3xl
                overflow-hidden
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition
              "
            >
              <img
                src={product.productImage}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold line-clamp-2">
                  {lang === "ar"
                    ? product.productNameArabic
                    : product.productNameEnglish}
                </h3>

                <p className="text-2xl font-black text-primary mt-3">
                  ${product.productPrice}
                </p>

                <button
                  onClick={() => addProduct(product)}
                  disabled={isSelected}
                  className={`
                    w-full mt-5 py-3 rounded-2xl font-bold transition
                    ${
                      isSelected
                        ? "bg-green-500 text-white"
                        : "bg-primary text-white"
                    }
                  `}
                >
                  {isSelected ? `✓ ${t("Added")}` : `+ ${t("Add")}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
          <h2 className="text-2xl font-black mb-6">{t("Selected Products")}</h2>

          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div
                key={item.productId}
                className="
                  flex flex-col md:flex-row
                  justify-between items-center
                  gap-4
                  p-5
                  rounded-3xl
                  border
                  hover:bg-gray-50
                "
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.productImage}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {lang === "ar"
                        ? item.product.productNameArabic
                        : item.product.productNameEnglish}
                    </h3>

                    <p className="text-primary font-bold">
                      ${item.product.productPrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, e.target.value)
                    }
                    className="
                      w-24
                      border rounded-xl
                      text-center
                      py-2
                    "
                  />

                  <button
                    onClick={() => removeProduct(item.productId)}
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-red-500
                      text-white
                    "
                  >
                    {t("Remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="
          w-full py-5
          rounded-3xl
          bg-primary text-white
          font-black text-lg
          hover:scale-[1.01]
          transition
        "
      >
        {isLoading ? t("Sending...") : `🎁 ${t("Send Gift Card")}`}
      </button>
    </div>
  );
};

export default CreateGiftCard;
