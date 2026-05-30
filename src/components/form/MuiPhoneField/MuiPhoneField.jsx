import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const CustomPhoneField = ({
  label,
  value,
  onChange,
  defaultCountry = "SY",
}) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>

      <div
        className="
          border border-gray-300
          rounded-2xl
          px-4 py-3
          bg-white
          focus-within:ring-2
          focus-within:ring-primary
          transition
        "
      >
        <PhoneInput
          international
          defaultCountry={defaultCountry}
          withCountryCallingCode
          value={value}
          onChange={(value) => onChange(value || "")}
          style={{
            direction: "ltr",
          }}
        />
      </div>
    </div>
  );
};

export default CustomPhoneField;
