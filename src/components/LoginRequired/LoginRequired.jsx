import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LoginRequired = ({ message, redirectTo = "/login", buttonText }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="text-center py-28 flex flex-col items-center gap-6">
      <p className="text-lg font-medium">
        {message || t("Please login to view this content")}
      </p>

      <button
        onClick={() => navigate(redirectTo)}
        className="px-6 py-2 rounded-lg bg-primary text-white
                   hover:bg-primary/90 transition"
      >
        {buttonText || t("Login")}
      </button>
    </div>
  );
};

export default LoginRequired;
