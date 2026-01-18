import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../../components/AuthButton/AuthButton";
import { useResendOtpMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { selectUser } from "../../redux/features/authSlice";

const VerifyResetCode = () => {
  const [resendOtp] = useResendOtpMutation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";

  const user = useSelector(selectUser);

  const email = sessionStorage.getItem("resetEmail");
  let userId = sessionStorage.getItem("resetUserId");
  if (user?.id) {
    userId = user.id;
    sessionStorage.setItem("resetUserId", userId);
  }

  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email || !userId) navigate("/forgot-password");
  }, [email, userId, navigate]);

  const schema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, t("Code must be 6 digits"))
      .required(t("This field is required")),
  });

  const onSubmit = (values) => {
    sessionStorage.setItem("resetOtp", values.otp);
    toast.success(t("Code verified"));
    navigate("/reset-password");
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp(email).unwrap();
      toast.success(t("Verification code resent"));
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to resend code"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">{t("Verify Code")}</h2>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          <Form>
            <MuiTextField name="otp" />
            <AuthButton label={t("Verify")} />
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

export default VerifyResetCode;
