import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useGetProductsQuery,
} from "../../redux/features/apiSlice";
import EmptyState from "../../components/EmptyState/EmptyState";
import emptyImg from "../../assets/images/Cart/Frame.png";
import ItemCard from "../../components/brands/ItemCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";

const LoginRequired = lazy(() =>
  import("../../components/LoginRequired/LoginRequired")
);

const WishList = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined, {
    skip: !token,
  });
  const { data: productsData } = useGetProductsQuery();
  const [removeFromWishlist, { isLoading: removing }] =
    useRemoveFromWishlistMutation();
  const productsImageMap = useMemo(() => {
    const map = {};
    productsData?.data?.forEach((product) => {
      map[product.id] = product.image;
    });
    return map;
  }, [productsData]);

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

  const items = wishlistData?.data?.wishlistItems || [];

  if (items.length === 0) {
    return <EmptyState imageSrc={emptyImg} titleKey="Your Wishlist Is Empty" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 py-24">
      {items.map((item) => {
        const normalizedProduct = {
          productId: Number(item.id),
          productNameEnglish: item.name_en,
          productNameArabic: item.name_ar,

          productDescriptionEnglish: item.description_en || "",
          productDescriptionArabic: item.description_ar || "",

          productPrice: Number(item.price),
          productImage: productsImageMap[item.id] || null,
          productFeaturesEnglish: item.features_en
            ? JSON.parse(item.features_en)
            : null,

          productFeaturesArabic: item.features_ar
            ? JSON.parse(item.features_ar)
            : null,
        };

        return (
          <div key={item.id} className="relative">
            <ItemCard
              product={normalizedProduct}
              wishlistItems={items}
              hoverScale={1.03}
              onClick={() =>
                navigate(`/products/${normalizedProduct.productId}`)
              }
            />

            <button
              disabled={removing}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const res = await removeFromWishlist({
                    productId: normalizedProduct.productId,
                  }).unwrap();
                  toast.success(res.message || t("Removed from your wishlist"));
                } catch (err) {
                  toast.error(err.data?.message || t("Failed to remove item"));
                }
              }}
              className="
    absolute top-4 left-4
    w-9 h-9
    rounded-full
    bg-red-100 hover:bg-red-200
    text-red-600
    flex items-center justify-center
    transition
    shadow
        "
            >
              {t("Remove from favorites")}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default WishList;
