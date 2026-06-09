import { HiGift } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GiftCardEmpty = ({ create = false }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20">
      <HiGift className="mx-auto text-6xl text-gray-400 mb-4" />

      <h3 className="text-2xl font-bold">
        {create ? t("No Gift Cards Yet") : t("Nothing Found")}
      </h3>

      <p className="text-gray-500 mt-3">
        {t("Start creating and sharing gift cards")}
      </p>

      <Link
        to="/gift-cards/create"
        className="inline-flex mt-6 px-6 py-3 rounded-xl bg-primary text-white"
      >
        {t("Create Gift Card")}
      </Link>
    </div>
  );
};

export default GiftCardEmpty;
