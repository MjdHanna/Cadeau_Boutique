import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAddToCartMutation } from "../../redux/features/apiSlice";
import { selectToken } from "../../redux/features/authSlice";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// 1. أضفنا adId هنا ضمن الـ Props
const AddToCartButton = ({ productId, variantId, addId, onSuccess }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const lang = useSelector(selectTranslate);
  const token = useSelector(selectToken);

  const handleAdd = async (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error(
        lang === "ar" ? "الرجاء تسجيل الدخول أولاً" : "Please login first",
      );
      return;
    }

    if (!variantId) {
      toast.error(
        lang === "ar"
          ? "يرجى اختيار خيار المنتج أولاً"
          : "Please select a product option first",
      );
      return;
    }

    try {
      const payload = {
        productId: Number(productId),
        variantId: Number(variantId),
        quantity: 1,
      };

      if (addId) {
        payload.addId = Number(addId);
      }

      await addToCart(payload).unwrap();

      toast.success(lang === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart");
      onSuccess?.();
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (lang === "ar" ? "حدث خطأ" : "Something went wrong"),
      );
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleAdd}
      disabled={isLoading}
      className="mt-4 w-full flex items-center justify-center gap-2
        bg-primary text-white py-2.5 rounded-xl font-semibold
        shadow-md hover:shadow-lg transition disabled:opacity-50"
    >
      <ShoppingCart size={18} />
      {lang === "ar" ? "أضف إلى السلة" : "Add to cart"}
    </motion.button>
  );
};

export default AddToCartButton;
