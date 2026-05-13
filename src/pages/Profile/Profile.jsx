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
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useGetUserQuery,
  useEditProfileMutation,
} from "../../redux/features/apiSlice";

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
  // const [profileImg, setProfileImg] = useState(null);

  const isRTL = lang === "ar";

  const profileInitialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    gender: user?.gender || "",
    birthDate: user?.birth_date || "",
    profileImg: null,
  };

  const profileValidationSchema = Yup.object({
    name: Yup.string().required(t("Name is required")),
    email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    phone_number: Yup.string().required(t("Phone number is required")),
    gender: Yup.string().required(t("Gender is required")),
    birthDate: Yup.string().required(t("Birth date is required")),
  });

  const handleProfileUpdate = async (values) => {
    try {
      await editProfile({
        ...values,
        profileImg: values.profileImg,
      }).unwrap();

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
    password: Yup.string().min(6).required(t("Password is required")),
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
  const getImageUrl = (path) => {
    if (!path) return null;

    if (path.startsWith("http")) return path;

    return `https://cdb-back.bw-businessworld.net/${path}`;
  };
  if (!token) {
    return (
      <Suspense fallback={<div className="text-center py-28">Loading...</div>}>
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
      className="min-h-screen flex items-center justify-center px-4 py-25 bg-gray-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row gap-8">
        {/* ================= USER INFO ================= */}
        <div className="flex-1 bg-gray-50 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-extrabold mb-4">
            {t("Your Information")}
          </h2>

          {userLoading ? (
            <div className="flex justify-center py-10">
              <CircularProgress size={30} />
            </div>
          ) : user ? (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* ================= PROFILE IMAGE ================= */}
              <div className="relative">
                <img
                  src={
                    getImageUrl(user.profile_img) ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />

                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>

              {/* ================= USER INFO ================= */}
              <div className="space-y-2 text-sm w-full">
                <p>
                  <b>{t("Name")}:</b> {user.name}
                </p>

                <p>
                  <b>{t("Email")}:</b> {user.email}
                </p>

                <p>
                  <b>{t("Phone")}:</b> {user.phone_number}
                </p>

                <p>
                  <b>{t("Gender")}:</b> {user.gender}
                </p>

                <p>
                  <b>{t("Birth Date")}:</b> {user.birth_date || "-"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* ================= EDIT FORM ================= */}
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

                {/* GENDER */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Gender")}
                  </label>

                  <Field
                    as="select"
                    name="gender"
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="">{t("Select gender")}</option>
                    <option value="male">{t("Male")}</option>
                    <option value="female">{t("Female")}</option>
                  </Field>

                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* ================= BIRTH DATE (NEW) ================= */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Birth Date")}
                  </label>

                  <Field
                    type="date"
                    name="birthDate"
                    className="w-full border rounded-lg p-2"
                  />

                  <ErrorMessage
                    name="birthDate"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* PROFILE IMAGE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("Profile Image")}
                  </label>

                  <Field name="profileImg">
                    {({ form }) => (
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border p-2 rounded-lg bg-white"
                        onChange={(e) => {
                          form.setFieldValue("profileImg", e.target.files[0]);
                        }}
                      />
                    )}
                  </Field>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={!dirty || !isValid || isSaving}
                >
                  {isSaving ? (
                    <CircularProgress size={22} />
                  ) : (
                    t("Save Changes")
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          {/* ================= DELETE ACCOUNT ================= */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <Formik
              initialValues={deleteInitialValues}
              validationSchema={deleteValidationSchema}
              onSubmit={handleDeleteSubmit}
            >
              <Form className="space-y-4">
                <MuiTextField name="email" label={t("Email")} />
                <MuiTextField
                  name="password"
                  type="password"
                  label={t("Password")}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <CircularProgress size={22} />
                  ) : (
                    t("Delete Account")
                  )}
                </Button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* ================= CONFIRM DIALOG ================= */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogTitle>{t("Confirm Delete")}</DialogTitle>
        <DialogContent>
          {t("Are you sure you want to delete your account?")}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t("Cancel")}</Button>

          <Button onClick={handleConfirmDelete} color="error">
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(Profile);
