import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-hot-toast";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://cadeau-boutique-production.up.railway.app/api/auth/google/me",
          {
            credentials: "include", // ⭐ مهم جدًا
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        dispatch(
          setCredentials({
            token: data.data.accessToken,
            user: {
              id: data.data.userId,
              name: data.data.userName,
              role: data.data.userAbility,
              vendorId: data.data.vendorId,
            },
          })
        );

        toast.success("Login successful with Google");
        navigate("/", { replace: true });
      } catch (err) {
        toast.error("Google login failed");
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export default GoogleCallback;
