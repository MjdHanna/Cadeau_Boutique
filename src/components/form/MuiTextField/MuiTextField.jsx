import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useField } from "formik";
import { useSelector } from "react-redux";
import { selectTranslate } from "../../../redux/features/translateSlice";

const MuiTextField = ({
  label,
  className = "",
  sx = {},
  name,
  formik = true,
  ...props
}) => {
  const lang = useSelector(selectTranslate);

  const isRTL = lang === "ar";

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [field, meta] = formik
    ? useField(name)
    : [{}, { touched: false, error: "" }];

  return (
    <div className={`mb-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <TextField
        fullWidth
        label={label}
        {...(formik ? field : {})}
        {...props}
        type={props.type === "password" && showPassword ? "text" : props.type}
        inputProps={{
          style: { textAlign: isRTL ? "right" : "left" },
          dir: isRTL ? "rtl" : "ltr",
          placeholder: props.placeholder,
        }}
        FormHelperTextProps={{
          sx: { textAlign: isRTL ? "right" : "left" },
        }}
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error ? meta.error : ""}
        InputProps={{
          endAdornment:
            props.type === "password" ? (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        sx={{
          direction: isRTL ? "rtl" : "ltr",

          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent !important",
            borderRadius: "18px",

            "&.Mui-focused": {
              backgroundColor: "transparent !important",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D9D9D9",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--primary)",
            },
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E5E7EB",
          },

          "& label.Mui-focused": {
            color: "var(--primary)",
          },

          "& .MuiInputBase-input": {
            textAlign: isRTL ? "right" : "left",
            backgroundColor: "transparent !important",
          },

          "& .MuiFormHelperText-root": {
            textAlign: isRTL ? "right" : "left",
          },

          ...sx,
        }}
      />
    </div>
  );
};

export default MuiTextField;
