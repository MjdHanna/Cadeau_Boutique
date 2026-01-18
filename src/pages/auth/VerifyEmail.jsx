import React, { memo, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { setCredentials } from "../../redux/features/authSlice";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../redux/features/apiSlice";
import { selectTranslate } from "../../redux/features/translateSlice";

import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../../components/AuthButton/AuthButton";
import p1 from "../../assets/images/authentication/p1.png";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";

  const loading = useSelector((state) => state.loader.isLoading);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();

  const [resendLoading, setResendLoading] = useState(false);

  const userId = sessionStorage.getItem("verifyUserId");
  const email = sessionStorage.getItem("verifyEmail");

  const schema = Yup.object({
    otp: Yup.string()
      .length(6, t("OTP must be 6 digits"))
      .required(t("Verification code is required")),
  });

  const onSubmit = async (values) => {
    if (!userId) {
      toast.error(t("Session expired, please register again"));
      navigate("/register");
      return;
    }

    dispatch(showLoader());
    try {
      const response = await verifyEmail({
        userId: Number(userId),
        otp: values.otp,
      }).unwrap();

      const token = response?.data?.accessToken;
      const user = {
        id: response.data.userId,
        name: response.data.userName,
        role: response.data.userAbility,
        vendorId: response.data.vendorId,
      };

      dispatch(setCredentials({ token, user }));

      sessionStorage.removeItem("verifyUserId");
      sessionStorage.removeItem("verifyEmail");

      toast.success(t("Account verified successfully"));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || t("Invalid verification code"), {
        position: "top-center",
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error(t("Email not found, please try again"));
      return;
    }

    setResendLoading(true);
    try {
      await resendOtp({ email }).unwrap();
      toast.success(t("Verification code resent"));
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to resend code"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={p1} alt="logo" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            {t("Verify Your Email")}
          </h2>
          <p className="text-gray-500 text-sm text-center">
            {t("Enter the verification code sent to your email")}
          </p>
        </div>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="otp"
              placeholder={t("Enter verification code")}
            />
            <AuthButton label={t("Verify")} loading={loading} />
          </Form>
        </Formik>

        <button
          type="button"
          disabled={resendLoading}
          onClick={handleResend}
          className="mt-4 w-full text-sm text-primary underline"
        >
          {resendLoading ? t("Sending...") : t("Resend Code")}
        </button>
      </div>
    </div>
  );
};

export default memo(VerifyEmail);
