import React, { Suspense, lazy, memo } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import { selectTranslate } from "../../redux/features/translateSlice";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRegisterMutation } from "../../redux/features/apiSlice";
import p1 from "../../assets/images/authentication/p1.png";
import { setCredentials } from "../../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

const MuiTextField = lazy(() =>
  import("../../components/form/MuiTextField/MuiTextField")
);
const MuiPhoneField = lazy(() =>
  import("../../components/form/MuiPhoneField/MuiPhoneField")
);
const AuthButton = lazy(() => import("../AuthButton/AuthButton"));

const RegisterLeft = memo(({ t, p1 }) => (
  <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center md:items-start justify-center p-6 sm:p-10 text-center md:text-left">
    <img src={p1} alt="logo" loading="lazy" className="h-20 sm:h-24 mb-4" />
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
      {t("Sign Up")}
    </h2>
    <p className="text-primary text-sm sm:text-base">
      {t("Welcome back to our store")}
    </p>
  </div>
));

const Register = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";
  const loading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();

  const [registerUser] = useRegisterMutation();

  const schema = Yup.object({
    fullName: Yup.string().required(t("Full name is required")),
    email: Yup.string()
      .email(t("Invalid email"))
      .required(t("Email is required")),
    gender: Yup.string().required(t("Gender is required")),
    phoneNumber: Yup.string()
      .matches(/^[+]?[0-9\s()-]+$/, t("Phone must contain only numbers"))
      .min(9, t("Phone must be at least 9 digits"))
      .required(t("Phone number is required")),
    password: Yup.string()
      .min(8, t("Password must be at least 6 characters"))
      .required(t("Password is required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("Passwords must match"))
      .required(t("Confirm password is required")),
  });

  const onSubmit = async (values, { resetForm }) => {
    dispatch(showLoader());
    try {
      const payload = {
        name: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        password_confirmation: values.confirmPassword,
      };

      console.log("REGISTER PAYLOAD ", payload);

      const response = await registerUser(payload).unwrap();

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

      toast.success(t("Registration successful!"), {
        position: "top-center",
        autoClose: 3000,
      });

      resetForm();
      navigate("/");
    } catch (error) {
      console.error("REGISTER ERROR ", error?.data);

      toast.error(
        error?.data?.message || t("Registration failed, please try again."),
        { position: "top-center" }
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-25 bg-gray-50 relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Toaster />
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div
          className={`flex flex-col md:flex-row ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <RegisterLeft t={t} p1={p1} />
          <Suspense
            fallback={<div className="p-8 text-center">Loading...</div>}
          >
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
              {() => (
                <Form className="w-full md:w-1/2 p-6 sm:p-10 space-y-4">
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">
                      {t("Full Name")}
                    </label>
                    <MuiTextField
                      name="fullName"
                      placeholder={t("Enter your full name")}
                    />
                  </div>

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
                      {t("Gender")}
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">{t("Select gender")}</option>
                      <option value="male">{t("Male")}</option>
                      <option value="female">{t("Female")}</option>
                    </Field>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">
                      {t("Phone Number")}
                    </label>
                    <MuiPhoneField name="phoneNumber" />
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
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-700 font-medium">
                      {t("Confirm Password")}
                    </label>
                    <MuiTextField
                      name="confirmPassword"
                      type="password"
                      placeholder={t("Re-enter your password")}
                    />
                  </div>
                  <AuthButton label={t("Sign Up")} loading={loading} />
                  <p className="text-center text-sm mt-4">
                    {t("Do you have an account?")}{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline font-semibold"
                    >
                      {t("Login")}
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default memo(Register);
