import React, { Suspense, lazy, memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTranslate } from "../../redux/features/translateSlice";
import { selectToken } from "../../redux/features/authSlice";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAccountDeleteMutation } from "../../redux/features/apiSlice";
import { logout as logoutAction } from "../../redux/features/authSlice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useGetUserQuery } from "../../redux/features/apiSlice";
import { useEditProfileMutation } from "../../redux/features/apiSlice";

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
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useAccountDeleteMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const isRTL = lang === "ar";

  const profileInitialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    gender: user?.gender || "",
  };

  const profileValidationSchema = Yup.object({
    name: Yup.string().required(t("Name is required")),
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    phone_number: Yup.string().required(t("Phone number is required")),
    gender: Yup.string().required(t("Gender is required")),
  });

  const handleProfileUpdate = async (values) => {
    try {
      await editProfile(values).unwrap();
      toast.success(t("Profile updated successfully"));
    } catch (error) {
      toast.error(error?.data?.message || t("Update failed"));
    }
  };

  const deleteInitialValues = { email: "", password: "" };
  const deleteValidationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    password: Yup.string()
      .min(6, t("Password must be at least 6 characters"))
      .required(t("Password is required")),
  });

  const handleDeleteSubmit = (values) => {
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

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-25 bg-gray-50`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-gray-50 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold mb-4">
            {t("Your Information")}
          </h2>
          {userLoading ? (
            <div className="text-center py-10">
              <CircularProgress size={30} />
            </div>
          ) : user ? (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-extrabold">{t("Name")}:</span>{" "}
                {user.name || "-"}
              </p>
              <p>
                <span className="font-extrabold">{t("Email")}:</span>{" "}
                {user.email || "-"}
              </p>
              <p>
                <span className="font-extrabold">{t("Phone")}:</span>{" "}
                {user.phone_number || "-"}
              </p>
              <p>
                <span className="font-extrabold">{t("Gender")}:</span>{" "}
                {user.gender || "-"}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex-1 space-y-6">
          <Formik
            enableReinitialize
            initialValues={profileInitialValues}
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ dirty, isValid }) => (
              <Form className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold">{t("Edit Profile")}</h2>
                <MuiTextField name="name" label={t("Name")} />
                <MuiTextField name="email" label={t("Email")} />
                <MuiTextField name="phone_number" label={t("Phone Number")} />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Gender")}
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full rounded-lg border p-2"
                  >
                    <option value="">{t("Select gender")}</option>
                    <option value="male">{t("Male")}</option>
                    <option value="female">{t("Female")}</option>
                  </Field>
                  <ErrorMessage name="gender">
                    {(msg) => <p className="text-red-500 text-sm">{msg}</p>}
                  </ErrorMessage>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={!dirty || !isValid || isSaving}
                >
                  {isSaving ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    t("Save Changes")
                  )}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <Formik
              initialValues={deleteInitialValues}
              validationSchema={deleteValidationSchema}
              onSubmit={handleDeleteSubmit}
            >
              <Form className="space-y-4">
                <MuiTextField
                  name="email"
                  type="email"
                  label={t("Email")}
                  placeholder={t("Enter your email")}
                />
                <MuiTextField
                  name="password"
                  type="password"
                  label={t("Password")}
                  placeholder={t("Enter your password")}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    t("Delete Account Permanently")
                  )}
                </Button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
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
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              t("Delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(Profile);
