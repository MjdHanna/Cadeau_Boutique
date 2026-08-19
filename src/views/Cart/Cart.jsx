import React, { useMemo, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import EmptyCartImage from "../../assets/images/Cart/Frame.png";
import CartItem from "./CartItem";
import GiftExperience from "./GiftExperience";
import OrderSummary from "./OrderSummary";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetCartQuery,
  useGetCouponsQuery,
  useGetUserQuery,
  useCalculateOrderPriceMutation,
  useCheckoutMutation,
} from "../../redux/features/apiSlice";
import Loader from "../Loader/Loader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import { useSelector } from "react-redux";

const Cart = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const isRTL = i18n.language === "ar";
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const { data: couponsData } = useGetCouponsQuery(undefined, { skip: !token });
  const { data: userData } = useGetUserQuery(undefined, { skip: !token });
  const [calculatePrice, { isLoading: isCalculatingPrice }] =
    useCalculateOrderPriceMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const availableCoupons = couponsData?.data || [];
  const userBalance = userData?.account_balance || 0;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [finalServerPrice, setFinalServerPrice] = useState(0);

  const cartItems = useMemo(() => {
    return (
      cartData?.data?.cartItems?.map((item) => ({
        cartItemId: item.cartItemId,
        productId: item.productId,
        variantId: item.variantId || null,
        productName:
          i18n.language === "ar"
            ? item.productNameArabic
            : item.productNameEnglish,
        image: item.productImage,
        quantity: Number(item.quantity),
        totalPrice: Number(item.totalPrice),
      })) || []
    );
  }, [cartData, i18n.language]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");

  const [giftData, setGiftData] = useState({
    enabled: true,
    coverId: null,
    coverPrice: 0,
    message: "",
    recipientType: "self",
    friendId: null,
    recipient: { name: "", phone: "", address: "" },
    deliveryDate: "",
  });

  const { itemsSubtotal, wrapPrice, discountAmount, finalTotal } =
    useMemo(() => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.totalPrice || 0),
        0,
      );

      const wrap = giftData.enabled ? Number(giftData.coverPrice || 0) : 0;

      let discount = 0;
      if (appliedCoupon) {
        const couponVal = Number(appliedCoupon.value || 0);
        if (appliedCoupon.type === "percent") {
          discount = (subtotal * couponVal) / 100;
        } else {
          discount = couponVal;
        }
      }

      const calculatedTotal = Math.max(0, subtotal + wrap - discount);

      return {
        itemsSubtotal: subtotal,
        wrapPrice: wrap,
        discountAmount: discount,
        finalTotal: calculatedTotal,
      };
    }, [cartItems, giftData.coverPrice, giftData.enabled, appliedCoupon]);

  const handleApplyCouponCode = (codeToApply) => {
    const targetCode = (codeToApply || couponInput).trim();
    if (!targetCode) return;

    const found = availableCoupons.find(
      (c) => c.code.toLowerCase() === targetCode.toLowerCase(),
    );

    if (found) {
      setAppliedCoupon(found);
      setCouponInput(found.code);
      toast.success(t("Coupon applied successfully!"));
    } else {
      toast.error(t("Invalid coupon code"));
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success(t("Coupon removed"));
  };

  
  const handleInitiateCheckout = async () => {
    try {
      
      const payload = {};

     
      if (appliedCoupon?.code) {
        payload.couponCode = appliedCoupon.code;
      }

     
      if (giftData.enabled && giftData.coverId) {
        payload.giftWrapperId = String(giftData.coverId);
      }

      

      const response = await calculatePrice(payload).unwrap();

      const serverPrice = Number(response?.data?.total) || finalTotal;
      setFinalServerPrice(serverPrice);
      setIsPaymentModalOpen(true);
    } catch (error) {
     
      toast.error(t("Failed to calculate order price."));
    }
  };
 
  const handleConfirmPayment = async () => {
    try {
     
      const todayDate = new Date().toISOString().split("T")[0];

     
      const checkoutPayload = {
        recipientType: giftData.recipientType || "self",
        deliveryDate: giftData.deliveryDate ? giftData.deliveryDate : todayDate,
        paymentMethod: "account_balance",
      };
      if (appliedCoupon?.code) {
        checkoutPayload.couponCode = appliedCoupon.code;
      }

      if (giftData.enabled) {
        if (giftData.coverId) {
          checkoutPayload.giftWrapperId = String(giftData.coverId);
        }
        if (giftData.message) {
          checkoutPayload.giftMessage = giftData.message;
        }
      }
      if (giftData.recipientType === "friend" && giftData.friendId) {
        checkoutPayload.friendId = giftData.friendId;
      } else if (giftData.recipientType === "manual") {
        if (giftData.recipient?.name)
          checkoutPayload.shippingName = giftData.recipient.name;
        if (giftData.recipient?.phone)
          checkoutPayload.shippingPhone = giftData.recipient.phone;
        if (giftData.recipient?.address)
          checkoutPayload.shippingAddress = giftData.recipient.address;
      }

      console.log("FINAL CHECKOUT PAYLOAD SENT:", checkoutPayload);

      await checkout(checkoutPayload).unwrap();

      setIsPaymentModalOpen(false);
      toast.success(t("Order placed and paid successfully!"), {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("خطأ الدفع من السيرفر:\n" + JSON.stringify(error?.data, null, 2));
      toast.error(error?.data?.message || t("Payment failed."));
    }
  };

  if (isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!token) {
    return (
      <Suspense fallback={<div className="text-center py-28">Loading...</div>}>
        <LoginRequired
          message={t("Please login to access your Cart")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#f5f7fb] relative"
    >
      <div className="max-w-7xl mx-auto px-4 py-26">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="xl:col-span-3 flex flex-col items-center justify-center text-center py-20"
            >
              <img
                src={EmptyCartImage}
                alt="Empty Cart"
                className="w-[260px] md:w-[340px] object-contain"
              />
              <h2 className="mt-8 text-3xl font-black text-gray-800">
                {t("Your Cart Is Empty")}
              </h2>
              <p className="mt-3 text-gray-500 text-lg">
                {t("Add items to start shopping")}
              </p>
            </motion.div>
          ) : (
            <>
              <div className="xl:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-[#7e2553]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">
                      {t("Have a Promo Code?")}
                    </h3>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl">
                    <span className="text-blue-500 text-lg flex-shrink-0">
                      💡
                    </span>
                    <p className="text-sm text-third leading-relaxed">
                      {t(
                        "Did you know? You can unlock special discount coupons after completing 5 orders with us!",
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t("Enter promo code")}
                      disabled={!!appliedCoupon}
                      className="w-full flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm uppercase tracking-wide disabled:bg-gray-50"
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors text-sm"
                      >
                        {t("Remove")}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyCouponCode()}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                      >
                        {t("Apply")}
                      </button>
                    )}
                  </div>
                  {availableCoupons.length > 0 && !appliedCoupon && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2.5 font-medium">
                        {t("Available Coupons:")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableCoupons.map((coupon) => (
                          <button
                            key={coupon.id}
                            onClick={() => handleApplyCouponCode(coupon.code)}
                            className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-2 sm:py-1.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-colors min-w-[140px]"
                          >
                            <div className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 text-[#7e2553] flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span>{coupon.code}</span>
                            </div>
                            <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                              {coupon.type === "percent"
                                ? `${coupon.value}% OFF`
                                : `$${coupon.value} OFF`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <AnimatePresence>
                    {appliedCoupon && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 overflow-hidden"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg flex-shrink-0">🎉</span>
                          <span className="leading-snug">
                            {t("Coupon")} <strong>{appliedCoupon.code}</strong>{" "}
                            {t("applied!")}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-800 self-end sm:self-auto">
                          -${discountAmount.toFixed(2)}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              

                <GiftExperience giftData={giftData} setGiftData={setGiftData} />
              </div>

              <OrderSummary
                subtotal={itemsSubtotal}
                wrapPrice={wrapPrice}
                discountAmount={discountAmount}
                total={finalTotal}
                appliedCoupon={appliedCoupon}
                items={cartItems}
                giftData={giftData}
                onOrderSuccess={handleInitiateCheckout}
                isProcessing={isCalculatingPrice}
              />
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="p-6 text-center bg-gray-50 border-b border-gray-100 relative">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition"
                >
                  ✕
                </button>
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-3xl mb-4 shadow-inner">
                  💳
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  {t("Complete Payment")}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {t("Review your balance before placing the order")}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <span className="font-semibold text-gray-700">
                      {t("Your Balance")}
                    </span>
                  </div>
                  <span className="font-bold text-lg text-blue-700">
                    ${userBalance.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛒</span>
                    <span className="font-semibold text-gray-700">
                      {t("Order Total")}
                    </span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    ${finalServerPrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 my-2" />

                {userBalance >= finalServerPrice ? (
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-green-50 border border-green-100">
                    <span className="font-bold text-green-800">
                      {t("Balance After Payment")}
                    </span>
                    <span className="font-black text-xl text-green-600">
                      ${(userBalance - finalServerPrice).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-center space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-800">
                        {t("Missing Amount")}
                      </span>
                      <span className="font-black text-xl text-red-600">
                        ${(finalServerPrice - userBalance).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-red-500 font-medium bg-red-100/50 p-2 rounded-lg">
                      ⚠️{" "}
                      {t(
                        "Insufficient balance. Please recharge your wallet to complete this order.",
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  disabled={isCheckingOut}
                  className="flex-1 px-4 py-3.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isCheckingOut || userBalance < finalServerPrice}
                  className={`flex-[2] px-4 py-3.5 rounded-xl font-bold text-white transition-all flex justify-center items-center gap-2 ${
                    userBalance >= finalServerPrice
                      ? "bg-primary hover:opacity-90 shadow-lg shadow-primary/30"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isCheckingOut ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>
                      {userBalance >= finalServerPrice
                        ? t("Pay & Place Order")
                        : t("Insufficient Balance")}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
