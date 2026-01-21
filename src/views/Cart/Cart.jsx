import React, { lazy, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { selectToken } from "../../redux/features/authSlice";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useCheckoutMutation,
} from "../../redux/features/apiSlice";

import EmptyState from "../../components/EmptyState/EmptyState";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import MuiPhoneField from "../../components/form/MuiPhoneField/MuiPhoneField";
import p from "../../assets/images/Cart/Frame.png";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);
const CheckoutSchema = Yup.object({
  shippingName: Yup.string().required("Full name is required"),
  shippingPhone: Yup.string().required("Phone number is required"),
  shippingAddress: Yup.string().required("Address is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
});

const Cart = () => {
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const {
    data: cartData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCartQuery(undefined, {
    skip: !token,
  });

  const [removeFromCart, { isLoading: removing }] = useRemoveFromCartMutation();

  const [checkout, { isLoading: placingOrder }] = useCheckoutMutation();
  const items = Array.isArray(cartData?.data?.cartItems)
    ? cartData.data.cartItems
    : [];
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  }, [items]);
  if (!token) {
    return (
      <Suspense
        fallback={
          <div className="text-center py-28 text-lg font-medium opacity-60">
            Loading...
          </div>
        }
      >
        <LoginRequired
          message={t("Please login to view your cart")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }
  if (isLoading || isFetching) {
    return (
      <div className="text-center py-28 text-lg font-medium opacity-60">
        {t("Loading cart...")}
      </div>
    );
  }
  if (isError) {
    console.error("Cart API Error:", error);
    return (
      <div className="text-center py-28 text-red-500 font-medium">
        {t("Failed to load cart")}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <EmptyState imageSrc={p} descriptionKey="Add items to start shopping" />
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-10 space-y-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="text-2xl font-bold">{t("Your Cart")}</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const productName = isRTL
            ? item.productNameArabic
            : item.productNameEnglish;

          return (
            <motion.div
              key={item.cartItemId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                gap-4 bg-white rounded-2xl p-5 shadow-md"
            >
              <div className="flex items-center gap-4">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={productName}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-lg">{productName}</h3>
                  <p className="text-sm text-gray-500">
                    {t("Quantity")}: {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    ${item.totalPrice}
                  </p>
                </div>
              </div>

              <button
                disabled={removing}
                onClick={() =>
                  removeFromCart({
                    productId: item.productId,
                    variantId: item.variantId,
                  })
                }
                className="text-red-500 font-medium hover:underline
                  disabled:opacity-50 self-start sm:self-auto"
              >
                {t("Remove")}
              </button>
            </motion.div>
          );
        })}
      </div>
      <Formik
        initialValues={{
          shippingName: "",
          shippingPhone: "",
          shippingAddress: "",
          paymentMethod: "cash",
        }}
        validationSchema={CheckoutSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await checkout(values).unwrap();
            navigate("/orders");
          } catch (err) {
            console.error("Checkout error:", err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 pt-6 border-t">
            <MuiTextField
              name="shippingName"
              label={t("Full Name")}
              placeholder={t("Enter your full name")}
            />

            <MuiPhoneField
              name="shippingPhone"
              label={t("Phone Number")}
              placeholder="+961..."
            />

            <MuiTextField
              name="shippingAddress"
              label={t("Shipping Address")}
              placeholder={t("City, Street, Building")}
            />

            <MuiTextField
              name="paymentMethod"
              label={t("Payment Method")}
              disabled
            />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <p className="text-xl font-bold">
                {t("Total")}: ${total.toFixed(2)}
              </p>

              <button
                type="submit"
                disabled={placingOrder || isSubmitting}
                className="bg-primary text-white px-8 py-3 rounded-xl
                  font-medium hover:opacity-90 disabled:opacity-50"
              >
                {placingOrder ? t("Placing order...") : t("Place Order")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Cart;
