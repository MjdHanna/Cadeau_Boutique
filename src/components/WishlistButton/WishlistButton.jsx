import { memo } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import { useAddToWishlistMutation } from "../../redux/features/apiSlice";

const WishlistButton = ({ product, wishlistItems }) => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const [addToWishlist, { isLoading }] = useAddToWishlistMutation();

  const isInWishlist = wishlistItems.some(
    (item) => Number(item.product_id) === Number(product.id)
  );

  const handleClick = async () => {
    if (!token) {
      toast.error(t("Please login first"));
      return;
    }

    if (isInWishlist || isLoading) return;

    try {
      await addToWishlist(product.id).unwrap();
      toast.success(t("Added to wishlist"));
    } catch (err) {
      console.error(err);

      if (err?.status === 409) {
        toast.error(err.data?.message);
        return;
      }

      toast.error(t("Failed to add to wishlist"));
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow"
    >
      <FaHeart className={isInWishlist ? "text-red-500" : "text-gray-400"} />
    </motion.button>
  );
};

export default memo(WishlistButton);
