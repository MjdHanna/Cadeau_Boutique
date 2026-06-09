import React, { useMemo, useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import EmptyCartImage from "../../assets/images/Cart/Frame.png";
import CartItem from "./CartItem";
import GiftExperience from "./GiftExperience";
import OrderSummary from "./OrderSummary";
import { selectToken } from "../../redux/features/authSlice";
import { useGetCartQuery } from "../../redux/features/apiSlice";
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
  const { data: cartData, isLoading } = useGetCartQuery();
  console.log(cartData);
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
  const [giftData, setGiftData] = useState({
    enabled: true,

    coverId: null,

    coverPrice: 0,

    message: "",

    recipientType: "self",

    friendId: null,

    couponCode: "",

    recipient: {
      name: "",
      phone: "",
      address: "",
    },

    deliveryDate: "",
  });

  const total = useMemo(() => {
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );

    const wrapPrice = giftData.enabled ? Number(giftData.coverPrice || 0) : 0;

    return itemsTotal + wrapPrice;
  }, [cartItems, giftData.coverPrice, giftData.enabled]);

  const handleOrderSuccess = () => {
    toast.success(t("Order placed successfully"), {
      duration: 3000,
      position: "top-center",
    });

    setTimeout(() => {
      navigate("/orders");
    }, 1500);
  };

  if (isLoading) {
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
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-7xl mx-auto px-4 py-26">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
      xl:col-span-3
      flex
      flex-col
      items-center
      justify-center
      text-center
      py-20
    "
            >
              <img
                src={EmptyCartImage}
                alt="Empty Cart"
                className="
        w-[260px]
        md:w-[340px]
        object-contain
      "
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

                <GiftExperience giftData={giftData} setGiftData={setGiftData} />
              </div>

              <OrderSummary
                total={total}
                items={cartItems}
                giftData={giftData}
                onOrderSuccess={handleOrderSuccess}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
