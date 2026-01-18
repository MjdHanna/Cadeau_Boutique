import React, { Suspense, lazy, memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { selectToken } from "../../redux/features/authSlice";
import { useTranslation } from "react-i18next";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAccountDeleteMutation } from "../../redux/features/apiSlice";
import { logout as logoutAction } from "../../redux/features/authSlice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const MuiTextField = lazy(
  () => import("../../components/form/MuiTextField/MuiTextField"),
);

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const Profile = () => {
  const token = useSelector(selectToken);
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRTL = lang === "ar";
  if (!token) {
    return (
      <Suspense
        fallback={
          <div className="text-center py-28 text-lg font-medium opacity-60">
            Loading...
          </div>
        }
      >
        <LoginRequired
          message={t("Please login to access your profile")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }
  const [deleteAccount, { isLoading }] = useAccountDeleteMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    password: Yup.string()
      .min(6, t("Password must be at least 6 characters"))
      .required(t("Password is required")),
  });

  const handleSubmit = (values) => {
    setFormValues(values);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(formValues).unwrap();
      dispatch(logoutAction());
      toast.success(t("Account deleted successfully"));
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || t("Account deletion failed"));
    } finally {
      setOpenDialog(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-xl font-bold text-center mb-6">{t("Profile")}</h1>

        <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">
                  {t("Email")}
                </label>
                <MuiTextField
                  name="email"
                  type="email"
                  placeholder={t("Enter your email")}
                />
                <ErrorMessage name="email">
                  {(msg) => <p className="text-red-500 text-sm">{msg}</p>}
                </ErrorMessage>
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">
                  {t("Password")}
                </label>
                <MuiTextField
                  name="password"
                  type="password"
                  placeholder={t("Enter your password")}
                />
                <ErrorMessage name="password">
                  {(msg) => <p className="text-red-500 text-sm">{msg}</p>}
                </ErrorMessage>
              </div>

              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("Delete Account Permanently")
                )}
              </Button>
            </Form>
          </Formik>
        </Suspense>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <DialogTitle>{t("Confirm Account Deletion")}</DialogTitle>
          <DialogContent>
            <p>
              {t("Are you sure you want to delete your account permanently?")}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>{t("Cancel")}</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                t("Delete")
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};
export default memo(Profile);
