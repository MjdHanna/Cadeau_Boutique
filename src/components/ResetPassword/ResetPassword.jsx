import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useResetPasswordMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";
import { selectUser } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  let userId = sessionStorage.getItem("resetUserId");

  if (user?.id) {
    userId = user.id;
    sessionStorage.setItem("resetUserId", userId);
  }

  const email = sessionStorage.getItem("resetEmail");
  const otp = sessionStorage.getItem("resetOtp");

  useEffect(() => {
    if (!userId || !otp || !email) navigate("/forgot-password");
  }, [userId, otp, email, navigate]);

  const validationSchema = Yup.object({
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required(),
  });

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      await resetPassword({
        user_id: Number(userId),
        otp,
        email,
        password,
        password_confirmation: confirmPassword,
      }).unwrap();
      sessionStorage.removeItem("resetUserId");
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOtp");

      toast.success(t("Password reset successfully"));
      setTimeout(() => {
        navigate("/login", { state: { email } });
      }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || t("Reset failed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("Reset Your Password")}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t("Enter your new password and confirm it a second time")}
          </p>
        </div>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <MuiTextField name="password" type="password" />
            <MuiTextField name="confirmPassword" type="password" />
            <AuthButton label={t("Set New Password")} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
