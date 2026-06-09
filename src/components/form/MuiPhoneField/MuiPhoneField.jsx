import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useField, useFormikContext } from "formik";

const MuiPhoneField = ({ label, name, defaultCountry = "SY" }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  return (
    <div>
      <label className="block mb-1 text-gray-700 font-medium">{label}</label>

      <div className="border border-gray-300 rounded-2xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-primary">
        <PhoneInput
          international
          defaultCountry={defaultCountry}
          value={field.value}
          onChange={(val) => setFieldValue(name, val || "")}
          style={{ direction: "ltr" }}
        />
      </div>

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default MuiPhoneField;
