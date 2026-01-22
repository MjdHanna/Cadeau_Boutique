import React, { Suspense } from "react"; // تأكد من استيراد React و Suspense
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/features/loaderSlice";
import Loader from "../Loader/Loader";
import logo from "../../assets/images/authentication/p1.png";
import toast from "react-hot-toast";
import { selectToken, selectUser } from "../../redux/features/authSlice";
import { useContactUsMutation } from "../../redux/features/apiSlice";
import { selectTranslate } from "../../redux/features/translateSlice";
const MuiTextField = React.lazy(
  () => import("../../components/form/MuiTextField/MuiTextField"),
);
const MuiPhoneField = React.lazy(
  () => import("../../components/form/MuiPhoneField/MuiPhoneField"),
);

const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loader.isLoading);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const lang = useSelector(selectTranslate);
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const [contactUs, { isLoading }] = useContactUsMutation();

  const handleSubmit = async (values, { resetForm }) => {
    if (!token) {
      toast.error(
        lang === "ar"
          ? "يجب عليك تسجيل الدخول لإرسال رسالة."
          : "You must be logged in to send a message",
      );
      return;
    }

    dispatch(showLoader());

    try {
      const payload = {
        userName: values.fullName,
        email: values.email,
        phoneNumber: values.phone,
        subject: values.subject,
        message: values.message,
      };

      const res = await contactUs(payload).unwrap();

      toast.success(res.message);
      resetForm();
    } catch (error) {
      toast.error(
        error?.data?.message || lang === "er"
          ? "حدث خطأ ما، يرجى المحاولة مرة أخرى"
          : "Something went wrong, please try again",
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required(t("This field is required")),
    email: Yup.string()
      .email(t("Invalid email"))
      .required(t("This field is required")),
    phone: Yup.string().required(t("This field is required")),
    subject: Yup.string().required(t("This field is required")),
    message: Yup.string()
      .min(10, t("Too short"))
      .required(t("This field is required")),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-25" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-around  text-center mb-8"
      >
        <img
          src={logo}
          width={100}
          height={100}
          loading="lazy"
          className="w-auto h-12 transition-transform duration-300 hover:scale-110"
          alt="logo"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {t("Contact Us")}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t("We are happy to hear from you. Please fill the form below.")}
          </p>
        </div>
      </motion.div>
      <Suspense fallback={<Loader />}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MuiTextField name="fullName" label={t("Full Name")} />
              <MuiTextField name="email" label={t("Email")} />
            </div>

            <MuiPhoneField name="phone" label={t("Phone Number")} />

            <MuiTextField name="subject" label={t("Subject")} />

            <MuiTextField
              name="message"
              label={t("Message")}
              multiline
              rows={4}
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary text-white py-3 rounded-lg font-semibold transition
    ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
            >
              {isLoading ? t("Sending...") : t("Send Message")}
            </button>
          </Form>
        </Formik>
      </Suspense>
    </div>
  );
};

export default Contact;
