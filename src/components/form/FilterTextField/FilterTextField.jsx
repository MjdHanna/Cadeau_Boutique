import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../../redux/features/translateSlice";

const FilterTextField = ({ label, value, onChange, ...props }) => {
  const { t } = useTranslation();
  const lang = useSelector(selectTranslate);
  const isRTL = lang === "ar";

  return (
    <TextField
      fullWidth
      label={t(label)}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      inputProps={{
        style: { textAlign: isRTL ? "right" : "left" },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "0.75rem",
        },
      }}
    />
  );
};

export default FilterTextField;
