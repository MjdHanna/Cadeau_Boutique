import { memo } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../redux/features/apiSlice";

const WishlistButton = ({ product, wishlistItems = [] }) => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);

  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] =
    useRemoveFromWishlistMutation();

  const actualProductId = product?.id || product?.productId;

  const isInWishlist = wishlistItems.some(
    (item) => Number(item.product_id ?? item.id) === Number(actualProductId),
  );

  const handleToggle = async () => {
    if (!token) {
      toast.error(t("Please login first"));
      return;
    }

    if (!actualProductId || adding || removing) return;

    try {
      if (isInWishlist) {
        await removeFromWishlist({
          productId: Number(actualProductId),
        }).unwrap();
        toast.success(t("Removed from wishlist"));
      } else {
        await addToWishlist({
          productId: Number(actualProductId),
        }).unwrap();
        toast.success(t("Added to wishlist"));
      }
    } catch (err) {
      toast.error(err?.data?.message || t("Something went wrong"));
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.9 }}
      disabled={adding || removing}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow disabled:opacity-50"
      title={isInWishlist ? t("Remove from wishlist") : t("Add to wishlist")}
    >
      <FaHeart
        className={`transition-colors duration-300 ${
          isInWishlist ? "text-red-500" : "text-gray-400"
        }`}
        size={18}
      />
    </motion.button>
  );
};

export default memo(WishlistButton);
