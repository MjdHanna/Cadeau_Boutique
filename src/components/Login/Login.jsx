import React, { Suspense, lazy, memo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "../../redux/features/apiSlice";
import { setCredentials } from "../../redux/features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import p1 from "../../assets/images/authentication/p1.png";
import FcGoogle from "../../assets/images/authentication/Google__G__logo.svg.png";
import FaFacebookF from "../../assets/images/authentication/png-transparent-fb-facebook-facebook-logo-social-media-icon-removebg-preview.png";
const MuiTextField = lazy(() =>
  import("../../components/form/MuiTextField/MuiTextField")
);
const SocialButtons = lazy(() =>
  import("../../components/form/SocialButtons/SocialButtons")
);
const AuthButton = lazy(() => import("../AuthButton/AuthButton"));

const LoginLeft = memo(({ t }) => (
  <div className="flex flex-col items-start space-y-3 w-full md:w-1/2">
    <img src={p1} alt="Logo" className="h-16 object-contain" loading="lazy" />
    <h2 className="text-3xl font-bold text-gray-900">{t("Login")}</h2>
    <p className="text-primary text-sm">{t("Login to access your account")}</p>
  </div>
));

const Login = () => {
  const lang = useSelector(selectTranslate);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = lang === "ar";
  const loading = useSelector((state) => state.loader.isLoading);
  const handledGoogle = useRef(false);
  const [login] = useLoginMutation();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    password: Yup.string()
      .min(8, t("Password must be at least 8 characters"))
      .required(t("Password is required")),
  });

  const onSubmit = async (values) => {
    dispatch(showLoader());
    try {
      const payload = {
        email: values.email.trim(),
        password: values.password,
      };

      const response = await login(payload).unwrap();

      const token = response?.data?.accessToken;

      if (!token) {
        throw new Error("Token missing from response");
      }

      const user = {
        id: response.data.userId,
        name: response.data.userName,
        role: response.data.userAbility,
        vendorId: response.data.vendorId,
      };

      dispatch(setCredentials({ token, user }));

      toast.success(t("Login successful!"), {
        position: "top-center",
        duration: 2500,
      });

      navigate("/");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          t("Login failed, please try again."),
        { position: "top-center", duration: 2500 }
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://cdb-back.bw-businessworld.net/api/auth/google/redirect";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8">
        <div
          className={`flex flex-col md:flex-row items-start gap-10 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <LoginLeft t={t} />

          <Suspense
            fallback={<div className="p-6 text-center">Loading...</div>}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              <Form className="w-full md:w-1/2 space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">
                    {t("Email Address")}
                  </label>
                  <MuiTextField
                    name="email"
                    placeholder={t("Enter your email")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">
                    {t("Password")}
                  </label>
                  <MuiTextField
                    name="password"
                    type="password"
                    placeholder={t("Enter your password")}
                  />
                  <ErrorMessage name="password">
                    {(msg) => <p className="text-red-500 text-sm">{msg}</p>}
                  </ErrorMessage>
                </div>

                <div className="flex justify-end">
                  <a
                    href="/forgot-password"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {t("Forgot Password?")}
                  </a>
                </div>

                <AuthButton label={t("Login")} loading={loading} />
                <SocialButtons
                  googleIcon={FcGoogle}
                  facebookIcon={FaFacebookF}
                  onGoogleClick={handleGoogleLogin}
                />
                <p className="text-gray-600 text-center">
                  {t("Don't have an account?")}{" "}
                  <a
                    href="/register"
                    className="text-primary font-semibold hover:underline"
                  >
                    {t("Create one")}
                  </a>
                </p>
              </Form>
            </Formik>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default memo(Login);
