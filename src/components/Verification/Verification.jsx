import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";
import { useVerifyCodeMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Verification = () => {
  const [verifyCode] = useVerifyCodeMutation();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("resetUserId"); // خزننا userId هنا
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const isRTL = lang === "ar";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);

  useEffect(() => {
    if (!userId) navigate("/forgot-password");
  }, [userId, navigate]);

  const initialValues = { otp: "" };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]+$/, t("Numbers only"))
      .required(t("Code is required")),
  });

  const onSubmit = async (values) => {
    try {
      dispatch(showLoader());

      await verifyCode({
        userId: parseInt(userId),
        otp: values.otp,
      }).unwrap();

      toast.success(t("Code verified successfully"));
      navigate("/reset-password");
    } catch (error) {
      toast.error(error?.data?.message || t("Invalid or expired code"));
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
          {t("Verification")}
        </h2>
        <p className="text-gray-500 mb-6">
          {t("Please enter the verification code")}
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="code"
              label={t("Verification Code")}
              maxLength={5}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <AuthButton label={t("Verify Code")} loading={loading} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Verification;
