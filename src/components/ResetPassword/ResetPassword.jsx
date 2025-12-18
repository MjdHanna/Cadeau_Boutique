import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";
import { useResetPasswordMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, t("Password must be at least 8 characters"))
      .required(t("Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("Passwords do not match"))
      .required(t("Confirm password is required")),
  });

  const onSubmit = async (values) => {
    const userId = sessionStorage.getItem("resetUserId");
    const otp = sessionStorage.getItem("resetOtp"); // احفظه بعد التحقق
    try {
      dispatch(showLoader());

      await resetPassword({
        userId: parseInt(userId),
        otp,
        password: values.password,
        password_confirmation: values.confirmPassword,
      }).unwrap();

      toast.success(t("Password reset successfully"));

      sessionStorage.removeItem("resetUserId");
      sessionStorage.removeItem("resetOtp");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to reset password"));
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
          {t("Set New Password")}
        </h2>
        <p className="text-gray-500 mb-6">
          {t("Please enter your new password")}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="password"
              type="password"
              label={t("Password")}
            />
            <MuiTextField
              name="confirmPassword"
              type="password"
              label={t("Confirm Password")}
            />
            <AuthButton label={t("Set New Password")} loading={loading} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
