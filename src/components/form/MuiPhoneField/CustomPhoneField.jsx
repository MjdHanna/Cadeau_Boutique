import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../../redux/features/translateSlice";

const CustomPhoneField = ({ label, value, onChange }) => {
  const lang = useSelector(selectTranslate);

  const isRTL = lang === "ar";

  return (
    <div>
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>

      <PhoneInput
        defaultCountry="SY"
        international
        withCountryCallingCode
        value={value}
        onChange={onChange}
        className="
          w-full
          p-3
          rounded-2xl
          border
          border-gray-300
          bg-white
          focus:ring-2
          focus:ring-primary
        "
        style={{
          direction: "ltr",
          textAlign: "left",
        }}
      />
    </div>
  );
};

export default CustomPhoneField;
