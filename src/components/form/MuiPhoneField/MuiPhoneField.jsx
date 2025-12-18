import { useField, useFormikContext } from "formik";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../../redux/features/translateSlice";

const MuiPhoneField = ({ name, label }) => {
  const [_, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";

  return (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <PhoneInput
        defaultCountry="SY"
        international
        withCountryCallingCode
        onChange={(value) => setFieldValue(name, value)}
        className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2"
        style={{
          direction: "ltr",
          textAlign: "left",
        }}
      />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm">{meta.error}</p>
      )}
    </div>
  );
};

export default MuiPhoneField;
