import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useAddToCartMutation } from "../../redux/features/apiSlice";
import { useTranslation } from "react-i18next";

const AddToCartButton = ({ productId, variantId = 1 }) => {
  const { t } = useTranslation();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAdd = async (e) => {
    e.stopPropagation();
    await addToCart({
      productId,
      variantId,
      quantity: 1,
    });
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
      {isLoading ? t("Adding...") : t("Add to Cart")}
    </motion.button>
  );
};

export default AddToCartButton;
