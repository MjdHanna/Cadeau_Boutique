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

  const togglePassword = () => setShowPassword((p) => !p);

  const formikField = formik && name ? useField(name) : null;

  const field = formikField ? formikField[0] : {};
  const meta = formikField ? formikField[1] : {};

  return (
    <div className={`mb-4 ${className}`} dir={isRTL ? "rtl" : "ltr"}>
      <TextField
        fullWidth
        label={label}
        {...(formik && name ? field : {})}
        {...props}
        type={props.type === "password" && showPassword ? "text" : props.type}
        InputProps={{
          endAdornment:
            props.type === "password" ? (
              <InputAdornment position="end">
                <IconButton onClick={togglePassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        error={Boolean(meta?.touched && meta?.error)}
        helperText={meta?.touched && meta?.error ? meta.error : ""}
        sx={{
          direction: isRTL ? "rtl" : "ltr",
          "& .MuiOutlinedInput-root": {
            borderRadius: "18px",
          },
          ...sx,
        }}
      />
    </div>
  );
};

export default MuiTextField;
