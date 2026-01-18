import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import AuthButton from "../AuthButton/AuthButton";
import { useVerifyCodeMutation } from "../../redux/features/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { selectTranslate } from "../../redux/features/translateSlice";

const VerifyResetCode = () => {
  const [verifyCode] = useVerifyCodeMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";
  const loading = useSelector((state) => state.loader.isLoading);

  const userId = sessionStorage.getItem("resetUserId");

  useEffect(() => {
    if (!userId) navigate("/forgot-password");
  }, [userId, navigate]);

  const schema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, t("Code must be 6 digits"))
      .required(t("Code is required")),
  });

  const onSubmit = async (values) => {
    dispatch(showLoader());
    try {
      await verifyCode({
        userId: Number(userId),
        otp: values.otp,
      }).unwrap();

      sessionStorage.setItem("resetOtp", values.otp);

      toast.success(t("Code verified successfully"));
      navigate("/reset-password");
    } catch (error) {
      toast.error(error?.data?.message || t("Invalid code"));
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">{t("Email Verification")}</h2>

        <Formik
          initialValues={{ otp: "" }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          <Form className="space-y-4">
            <MuiTextField
              name="otp"
              placeholder={t("Verification Code")}
              inputProps={{ maxLength: 6 }}
              onInput={(e) =>
                (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <AuthButton label={t("Verify")} loading={loading} />
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default VerifyResetCode;
