import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Home: "Home",
      Wishlist: "Wishlist",
      Trackorder: "Track order",
      About: "About Us",
      Contact: "Contact",
      Login: "Login",
      "Sign Up": "Sign Up",
      "Phone Number": "Phone Number",
      Password: "Password",
      "Forgot Password?": "Forgot Password?",
      "Continue with Google": "Continue with Google",
      "Continue with Facebook": "Continue with Facebook",
      "Don't have an account?": "Don't have an account?",
      "Create one": "Create one",
      "Full Name": "Full Name",
      "Email Address": "Email Address",
      Gender: "Gender",
      "Select gender": "Select gender",
      Male: "Male",
      Female: "Female",
      "Already have an account?": "Already have an account?",
      "Click here to login": "Click here to login",
      "Reset With Email": "Reset With Email",
      "Please enter your email address to get a verification code.":
        "Please enter your email address to get a verification code.",
      "Send Reset Link": "Send Reset Link",
      "Set New Password": "Set New Password",
      "Please enter your new password": "Please enter your new password",
      "Confirm Password": "Confirm Password",
      Verification: "Verification",
      "Please enter verification code": "Please enter verification code",
      "Verification Code": "Verification Code",
      "Enter full name": "Enter full name",
      "Welcome back to our store": "Welcome back to our store",
      CelebrateEveryMoment: "Celebrate Every Moment",
      FindBeautifulGiftsAndFlowers:
        "Find beautiful gifts, flowers, and decorations for every occasion",
      DelightWithChocolate: "Delight with Chocolate",
      HandcraftedChocolatesForEveryOccasion:
        "Handcrafted chocolates for birthdays, anniversaries, and celebrations",
      GiftsForLovedOnes: "Gifts for Loved Ones",
      MakeSpecialDaysUnforgettable:
        "Make special days unforgettable with our unique gift collections",
      Latest: "Latest",
      title: "Shop By Brand",
    },
  },
  ar: {
    translation: {
      Home: "الرئيسية",
      Wishlist: "قائمة الاشياء المفضلة",
      Trackorder: "تتبع الطلب",
      About: "من نحن",
      Contact: "تواصل معنا",
      Login: "تسجيل دخول",
      "Sign Up": "إنشاء حساب",
      "Phone Number": "رقم الهاتف",
      Password: "كلمة المرور",
      "Forgot Password?": "نسيت كلمة المرور؟",
      "Continue with Google": "تسجيل الدخول عبر جوجل",
      "Continue with Facebook": "تسجيل الدخول عبر فيسبوك",
      "Don't have an account?": "ليس لديك حساب؟",
      "Create one": "إنشاء حساب",
      "Full Name": "الاسم الكامل",
      "Email Address": "البريد الإلكتروني",
      Gender: "الجنس",
      "Select gender": "اختر الجنس",
      Male: "ذكر",
      Female: "أنثى",
      "Already have an account?": "هل لديك حساب بالفعل؟",
      "Click here to login": "اضغط هنا لتسجيل الدخول",
      "Reset With Email": "إعادة التعيين عبر البريد الإلكتروني",
      "Please enter your email address to get a verification code.":
        "الرجاء إدخال بريدك الإلكتروني للحصول على رمز التحقق.",
      "Send Reset Link": "إرسال رابط إعادة التعيين",
      "Set New Password": "تعيين كلمة مرور جديدة",
      "Please enter your new password": "الرجاء إدخال كلمة المرور الجديدة",
      "Confirm Password": "تأكيد كلمة المرور",
      Verification: "التحقق",
      "Please enter verification code": "الرجاء إدخال رمز التحقق",
      "Verification Code": "رمز التحقق",
      "Enter full name": "ادخل الاسم الكامل ",
      "Welcome back to our store": "مرحباً بكم مرة أخرى في متجرنا",
      CelebrateEveryMoment: "احتفل بكل مناسبة",
      FindBeautifulGiftsAndFlowers:
        "اكتشف أجمل الهدايا والزهور والزينة لكل مناسبة",
      DelightWithChocolate: "استمتع بالشوكولا",
      HandcraftedChocolatesForEveryOccasion:
        "شوكولا مصنوعة يدويًا لأعياد الميلاد والذكريات والمناسبات",
      GiftsForLovedOnes: "هدايا لأحبائك",
      MakeSpecialDaysUnforgettable:
        "اجعل أيامك المميزة لا تُنسى مع مجموعتنا الفريدة من الهدايا",
      Latest: "أحدث المنتجات",
      title: "تسوق حسب الماركة",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
