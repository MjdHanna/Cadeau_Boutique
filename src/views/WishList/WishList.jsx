import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../redux/features/apiSlice";
import EmptyState from "../../components/EmptyState/EmptyState";
import emptyImg from "../../assets/images/Cart/Frame.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginRequired = lazy(() =>
  import("../../components/LoginRequired/LoginRequired")
);

const WishList = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const { data, isLoading } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const [removeFromWishlist, { isLoading: removing }] =
    useRemoveFromWishlistMutation();
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
          message={t("Please login to view your wishlist")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const items = data?.data?.wishlistItems || [];
  if (items.length === 0) {
    return <EmptyState imageSrc={emptyImg} titleKey="Your Wishlist Is Empty" />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6 py-25">
      {items.map((item) => (
        <div
          key={item.id}
          className="
            bg-white dark:bg-gray-900
            rounded-xl shadow-md hover:shadow-xl
            transition p-4
            border border-gray-100 dark:border-gray-700
          "
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover rounded-lg"
          />

          <h3 className="mt-4 font-semibold text-lg text-center">
            {item.name}
          </h3>

          <p className="text-primary text-xl text-center mt-1">{item.price}</p>

          <button
            disabled={removing}
            onClick={async () => {
              try {
                const res = await removeFromWishlist(item.id).unwrap();
                toast.success(res.message || t("Removed from your wishlist"));
              } catch (err) {
                console.error(err);
                toast.error(err.data?.message || t("Failed to remove item"));
              }
            }}
            className="
    mt-4 w-full py-2
    bg-red-500 hover:bg-red-600
    disabled:opacity-50
    text-white
    rounded-lg
    transition
  "
          >
            {t("Remove from favorites")}
          </button>
        </div>
      ))}
    </div>
  );
};
export default WishList;
