import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetBrandByIdQuery,
  useGetWishlistQuery,
  useFollowBrandMutation,
  useUnfollowBrandMutation,
  useIsFollowingBrandQuery,
} from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";
import { useNavigate } from "react-router-dom";

const BrandDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetBrandByIdQuery(id);
  const {
    data: followData,
    isLoading: isFollowLoading,
    refetch: refetchFollowStatus,
  } = useIsFollowingBrandQuery(id, {
    skip: !token || !id,
  });

  const [followBrand, { isLoading: isFollowingBrandLoading }] =
    useFollowBrandMutation();

  const [unfollowBrand, { isLoading: isUnfollowingBrandLoading }] =
    useUnfollowBrandMutation();

  const isFollowing =
    followData?.isFollowing || followData?.data?.isFollowing || false;
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const wishlistItems = wishlistData?.data?.wishlistItems || [];
  const followersCount = data?.data?.followersCount || 0;
  const brand = useMemo(() => {
    if (!data?.data?.brand) return null;

    const b = data.data.brand;

    return {
      ...b,
      brandName:
        i18n.language === "ar" ? b.brandNameArabic : b.brandNameEnglish,
      brandDescription:
        i18n.language === "ar"
          ? b.brandDescriptionArabic
          : b.brandDescriptionEnglish,
    };
  }, [data, i18n.language]);
  const products = useMemo(() => {
    if (!data?.data?.products) return [];
    return data.data.products.map((p) => ({
      ...p,
      productName:
        i18n.language === "ar" ? p.productNameArabic : p.productNameEnglish,
      productDescription:
        i18n.language === "ar"
          ? p.productDescriptionArabic
          : p.productDescriptionEnglish,
    }));
  }, [data, i18n.language]);
  const handleFollowToggle = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        await unfollowBrand(id).unwrap();
      } else {
        await followBrand(id).unwrap();
      }

      refetchFollowStatus();
    } catch (error) {
      console.error(error);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        {t("Failed to load brand data")}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24">
      <div className="relative mt-22 h-[420px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
        <img
          src={brand?.brandCoverImg}
          alt="brand cover"
          className="absolute w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden mb-5">
            <img
              src={brand?.brandLogo}
              alt="brand logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-white text-3xl sm:text-5xl font-extrabold tracking-wide drop-shadow-lg">
            {brand?.brandName}
          </h1>
          <div className="w-20 h-[2px] bg-white/60 my-4 rounded-full" />
          <p className="text-white/90 text-sm sm:text-lg max-w-2xl leading-relaxed">
            {brand?.brandDescription}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base shadow-lg">
              <span className="font-bold">{followersCount}</span>{" "}
              {followersCount === 1 ? t("Follower") : t("Followers")}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleFollowToggle}
              disabled={
                isFollowingBrandLoading ||
                isUnfollowingBrandLoading ||
                isFollowLoading
              }
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg backdrop-blur-md border
      ${
        isFollowing
          ? "bg-white text-black border-white hover:bg-red-500 hover:text-white"
          : "bg-black/40 text-white border-white/30 hover:bg-white hover:text-black"
      }
    `}
            >
              {isFollowing ? t("Unfollow brand") : t("Follow Brand")}
            </button>
          </div>
          <button
            onClick={() =>
              document.getElementById("products-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-6 px-6 py-2 rounded-full bg-white text-black font-medium hover:scale-105 transition"
          >
            {t("View Products")}
          </button>
        </div>
      </div>
      <div id="products-section" className="mt-16">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">{t("No products found")}</p>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {t("Products")}
              </h2>
              <p className="text-gray-500 mt-2">
                {t("Explore all products from this brand")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ItemCard
                  key={product.productId}
                  image={null}
                  title={product.productName}
                  description={product.productDescription}
                  price={product.productPrice}
                  product={product}
                  wishlistItems={wishlistItems}
                  onClick={() => navigate(`/products/${product.productId}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandDetails;
