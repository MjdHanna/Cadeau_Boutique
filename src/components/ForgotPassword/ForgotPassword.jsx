import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { useForgotPasswordMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";
import { selectTranslate } from "../../redux/features/translateSlice";
import { selectUser } from "../../redux/features/authSlice";
const ForgotPassword = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate();
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = lang === "ar";
  const loading = useSelector((state) => state.loader.isLoading);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Enter a valid email"))
      .required(t("Email is required")),
  });

  const user = useSelector(selectUser);

  const onSubmit = async (values) => {
    dispatch(showLoader());
    try {
      const response = await forgotPassword(values.email.trim()).unwrap();

      sessionStorage.setItem("resetEmail", values.email.trim());
      if (user?.id) {
        sessionStorage.setItem("resetUserId", user.id);
      } else {
        sessionStorage.setItem("resetUserId", response.user_id);
      }

      toast.success(t("Verification code sent to your email"));
      navigate("/verify-reset-code");
    } catch (error) {
      toast.error(error?.data?.message || t("Failed to send code"));
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
        <h2 className="text-2xl font-bold mb-2">{t("Reset With Email")}</h2>
        <p className="text-gray-500 mb-6">
          {t("Please enter your email address to get a verification code.")}
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="email"
              type="email"
              label={t("Email Address")}
            />
            <AuthButton label={t("Send Code")} loading={loading} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
