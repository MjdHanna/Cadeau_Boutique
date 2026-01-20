import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAddToCartMutation } from "../../redux/features/apiSlice";
import { useTranslation } from "react-i18next";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useSelector } from "react-redux";
const AddToCartButton = ({ productId, variantId }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const lang = useSelector(selectTranslate);

  const handleAdd = async (e) => {
    e.stopPropagation();
    try {
      const payload = {
        productId: Number(productId),
        quantity: 1,
      };

      if (variantId) {
        payload.variantId = Number(variantId);
      }

      await addToCart(payload).unwrap();
    } catch (err) {
      console.error("Add to cart failed:", err);
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
