import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-hot-toast";
// استيراد الـ hook الجاهز من apiSlice الذي قمت بتعريفه مسبقاً
import { apiSlice } from "../../redux/features/apiSlice";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // استخدام Lazy Query لكي نقوم بتشغيل الطلب يدوياً عند تحميل المكون
  const [triggerGoogleMe] = apiSlice.endpoints.googleMe.useLazyQuery();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // سيقوم هذا الطلب بالذهاب إلى cdb-back.bw-businessworld.net/api/auth/google/me
        // وسيرسل الـ cookies تلقائياً بفضل إعدادات credentials
        const response = await triggerGoogleMe().unwrap();

        // تأكد من هيكل البيانات القادمة من الباك إند
        const token = response?.data?.accessToken;

        if (!token) {
          throw new Error("Token missing");
        }

        dispatch(
          setCredentials({
            token: token,
            user: {
              id: response.data.userId,
              name: response.data.userName,
              role: response.data.userAbility,
              vendorId: response.data.vendorId,
            },
          }),
        );

        toast.success("Login successful with Google", {
          position: "top-center",
          duration: 2500,
        });

        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google login error:", err);
        toast.error("Google login failed", { position: "top-center" });
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [dispatch, navigate, triggerGoogleMe]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export default GoogleCallback;
