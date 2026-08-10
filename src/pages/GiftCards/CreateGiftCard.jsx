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
  useGetBrandsQuery,
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
  const [selectedBrands, setSelectedBrands] = useState(new Set());

  const { data: friendsData } = useGetFriendsQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery();

  const [createGiftCard, { isLoading }] = useCreateGiftCardMutation();

  const brands = useMemo(() => brandsData?.data ?? [], [brandsData]);

  const toggleBrand = useCallback((brandId) => {
    setSelectedBrands((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brandId)) {
        newSet.delete(brandId);
      } else {
        newSet.add(brandId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!receiverId || !budget) {
      toast.warning(t("Please fill the friend and budget fields"));
      return;
    }

    try {
      const payload = {
        receiverId: Number(receiverId),
        budget: Number(budget),
        recipientType: "friend",
        message,

        brands: Array.from(selectedBrands).map((id) => ({
          brandId: Number(id),
        })),
      };

      await createGiftCard(payload).unwrap();

      toast.success(t("Gift card sent successfully 🎉"));
      navigate("/gift-cards/sent");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to create gift card"));
    }
  }, [
    receiverId,
    budget,
    message,
    selectedBrands,
    createGiftCard,
    navigate,
    t,
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
          {t("Set a budget and optionally choose favorite brands")}
        </p>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 px-4 py-4 mb-5 focus:ring-2 focus:ring-primary outline-none"
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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">
          {t("Select Brands (Optional)")}
        </h2>
        <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold">
          {selectedBrands.size} {t("Selected")}
        </span>
      </div>

      {isLoadingBrands ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {brands.map((brand) => {
            const isSelected = selectedBrands.has(brand.brandId);

            return (
              <motion.div
                whileHover={{ y: -5 }}
                key={brand.brandId}
                onClick={() => toggleBrand(brand.brandId)}
                className={`
                  relative cursor-pointer bg-white rounded-3xl overflow-hidden transition-all duration-300 border-2
                  ${
                    isSelected
                      ? "border-primary shadow-xl ring-4 ring-primary/10"
                      : "border-gray-100 hover:border-gray-300 hover:shadow-lg"
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 z-20 bg-primary text-white rounded-full p-1.5 shadow-md">
                    <svg
                      className="w-4 h-4"
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

                <div className="h-28 w-full bg-gray-100 relative">
                  <img
                    src={brand.brandCoverImg}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md">
                    <img
                      src={brand.brandLogo}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-full bg-white"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="pt-12 pb-5 px-4 text-center">
                  <h3
                    className={`font-black text-lg truncate ${isSelected ? "text-primary" : "text-gray-900"}`}
                  >
                    {isRTL ? brand.brandNameArabic : brand.brandNameEnglish}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10 leading-tight">
                    {isRTL
                      ? brand.brandDescriptionArabic
                      : brand.brandDescriptionEnglish}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-5 rounded-3xl bg-primary text-white font-black text-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
