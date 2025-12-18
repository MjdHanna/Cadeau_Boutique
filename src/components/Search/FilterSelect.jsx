import React from "react";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const FilterSelect = ({ name, value, onChange, placeholder, options }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <FormControl fullWidth size="small" dir={isArabic ? "rtl" : "ltr"}>
      <InputLabel
        sx={{
          color: "#444",

          "&.Mui-focused": {
            color: "#444 !important",
          },

          "&.MuiInputLabel-shrink": {
            color: "#444 !important",
          },
        }}
      >
        {t(placeholder)}
      </InputLabel>

      <Select
        name={name}
        value={value}
        label={t(placeholder)}
        onChange={onChange}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: isArabic ? "right" : "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: isArabic ? "right" : "left",
          },
        }}
        sx={{
          background: "white",
          borderRadius: "8px",
          textAlign: isArabic ? "right" : "left",

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9 !important",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9",
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t(opt.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
