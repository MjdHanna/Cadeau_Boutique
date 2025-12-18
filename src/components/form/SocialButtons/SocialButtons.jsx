import React from "react";
import { useTranslation } from "react-i18next";

const SocialButtons = ({ googleIcon, facebookIcon, onGoogleClick }) => {
  const { t } = useTranslation();

  const btnClasses =
    "flex items-center justify-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition w-full";

  return (
    <div className="flex flex-col gap-3">
      <button className={btnClasses} type="button" onClick={onGoogleClick}>
        <img src={googleIcon} alt="Google Logo" className="w-5 h-5" />
        {t("Continue with Google")}
      </button>
    </div>
  );
};

export default SocialButtons;
