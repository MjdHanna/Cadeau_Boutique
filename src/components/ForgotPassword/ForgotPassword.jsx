import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { useForgotPasswordMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";

const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);

  const initialValues = { email: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Enter a valid email"))
      .required(t("Email is required")),
  });

  const onSubmit = async (values) => {
    try {
      dispatch(showLoader());

      await forgotPassword(values.email.trim()).unwrap();

      toast.success(t("Verification code sent to your email"));
      sessionStorage.setItem("resetEmail", values.email.trim());
      navigate("/VerifyCode");
    } catch (error) {
      toast.error(
        error?.data?.message || t("Failed to send verification code")
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {t("Reset With Email")}
        </h2>
        <p className="text-gray-500 mb-6">
          {t("Please enter your email address to get a verification code.")}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="email"
              type="email"
              label={t("Email Address")}
            />
            <div className="text-sm text-gray-500 text-right">
              {t("Remember your password?")}{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary hover:underline cursor-pointer"
              >
                {t("Login")}
              </span>
            </div>

            <AuthButton label={t("Send Code")} loading={loading} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
