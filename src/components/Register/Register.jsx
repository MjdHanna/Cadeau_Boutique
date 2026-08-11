import React, { Suspense, lazy, memo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { selectTranslate } from "../../redux/features/translateSlice";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRegisterMutation } from "../../redux/features/apiSlice";
import p1 from "../../assets/images/NavBar/a_logo_for_a_gift_app_named_bella_regalo_keep_the_exact_icon_from.png";

const MuiTextField = lazy(
  () => import("../../components/form/MuiTextField/MuiTextField"),
);
const MuiPhoneField = lazy(
  () => import("../../components/form/MuiPhoneField/MuiPhoneField"),
);
const AuthButton = lazy(() => import("../AuthButton/AuthButton"));

const RegisterLeft = memo(({ t }) => (
  <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center md:items-start justify-center p-6 sm:p-10">
    <img src={p1} alt="logo" className="h-20 mb-4" />
    <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("Sign Up")}</h2>
    <p className="text-primary">{t("Welcome back to our store")}</p>
  </div>
));

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";
  const loading = useSelector((state) => state.loader.isLoading);

  const [registerUser] = useRegisterMutation();

  const schema = Yup.object({
    fullName: Yup.string().required(t("Full name is required")),
    email: Yup.string().email().required(t("Email is required")),
    gender: Yup.string().required(t("Gender is required")),
    phoneNumber: Yup.string().required(t("Phone number is required")),
    password: Yup.string().min(8).required(t("Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")])
      .required(t("Confirm password is required")),
  });

  const onSubmit = async (values, { resetForm }) => {
    dispatch(showLoader());
    try {
      const payload = {
        name: values.fullName.trim(),
        email: values.email.trim(),
        gender: values.gender,
        phoneNumber: values.phoneNumber.replace(/\D/g, ""),
        password: values.password,
        password_confirmation: values.confirmPassword,
      };

      const response = await registerUser(payload).unwrap();

      const userId = response?.data?.user?.userId;
      if (!userId) {
        console.error("REGISTER RESPONSE:", response);
        throw new Error("UserId missing");
      }

      sessionStorage.setItem("verifyUserId", userId);

      toast.success(t("Verification code sent to your email"));
      resetForm();
      navigate("/verify-email");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || t("Registration failed"),
        { position: "top-center" },
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center mt-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster />
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <RegisterLeft t={t} />
        <Suspense fallback={<div>Loading...</div>}>
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              gender: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={schema}
            onSubmit={onSubmit}
          >
            <Form className="w-full md:w-1/2 p-8 space-y-4">
              <MuiTextField name="fullName" placeholder={t("Full Name")} />
              <MuiTextField name="email" placeholder={t("Email")} />
              <Field
                as="select"
                name="gender"
                className="w-full p-3 border rounded-[18px] bg-transparent"
              >
                <option value="">{t("Select gender")}</option>
                <option value="male">{t("Male")}</option>
                <option value="female">{t("Female")}</option>
              </Field>
              <MuiPhoneField name="phoneNumber" />
              <MuiTextField
                name="password"
                type="password"
                placeholder={t("Password")}
              />
              <MuiTextField
                name="confirmPassword"
                type="password"
                placeholder={t("Confirm Password")}
              />
              <AuthButton label={t("Sign Up")} loading={loading} />
              <p className="text-center">
                {t("Do you have an account?")}{" "}
                <Link to="/login" className="text-primary font-semibold">
                  {t("Login")}
                </Link>
              </p>
            </Form>
          </Formik>
        </Suspense>
      </div>
    </div>
  );
};

export default memo(Register);
