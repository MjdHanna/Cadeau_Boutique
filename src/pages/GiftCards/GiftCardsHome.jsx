import GiftCardSection from "../../views/GiftCard/GiftCard";
import { selectToken } from "../../redux/features/authSlice";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import LoginRequired from "../../components/LoginRequired/LoginRequired";
import { useTranslation } from "react-i18next";
const GiftCardsHome = () => {
  const token = useSelector(selectToken);
  const { t } = useTranslation();
  if (!token) {
    return (
      <Suspense fallback={<div className="text-center py-28">Loading...</div>}>
        <LoginRequired
          message={t("Please login to access your gift cards")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }
  return (
    <div className="min-h-screen">
      <GiftCardSection />
    </div>
  );
};

export default GiftCardsHome;
