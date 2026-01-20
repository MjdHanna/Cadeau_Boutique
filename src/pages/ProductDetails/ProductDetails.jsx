import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useGetProductByIdQuery } from "../../redux/features/apiSlice";
import { useAddProductRatingMutation } from "../../redux/features/apiSlice";
import StarRating from "../../components/StarRating/StarRating";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import { useEffect, useState } from "react";
import { selectTranslate } from "../../redux/features/translateSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const lang = useSelector(selectTranslate);
  const isRTL = i18n.language === "ar";
  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");

  const token = useSelector(selectToken);
  const [addRating, { isLoading: ratingLoading }] =
    useAddProductRatingMutation();

  const product = data?.data;
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const localized = useMemo(() => {
    if (!product) return null;

    return {
      name: isRTL ? product.productNameArabic : product.productNameEnglish,
      description: isRTL
        ? product.productDescriptionArabic
        : product.productDescriptionEnglish,
      features: isRTL
        ? product.featuresArabic || null
        : product.featuresEnglish || null,
      price: product.price,
      images: Array.isArray(product.images) ? product.images : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
    };
  }, [product, isRTL]);
  useEffect(() => {
    if (product?.userRating) {
      setUserRating(product.userRating);
    }
  }, [product]);
  const handleRate = async (value) => {
    if (!token) {
      toast.error(t("Please login to rate this product"));
      return;
    }

    const finalRating = value === userRating ? null : value;

    try {
      await addRating({
        productId: id,
        rating: finalRating,
        review,
      }).unwrap();

      setUserRating(finalRating || 0);
      setReview("");

      toast.success(
        finalRating ? t("Thanks for your rating ❤️") : t("Rating removed"),
      );
    } catch (err) {
      toast.error(err?.data?.message || t("Something went wrong"));
    }
  };

  if (isLoading) {
    return <p className="text-center py-20">{t("Loading...")}</p>;
  }

  if (error || !localized) {
    return (
      <p className="text-center py-20 text-red-500">
        {t("Failed to load product")}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {localized.images.length > 0 ? (
            <img
              src={localized.images[0]}
              alt={localized.name}
              className="w-full h-96 object-cover rounded-3xl shadow"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-3xl">
              {t("No image available")}
            </div>
          )}

          {localized.images.length > 1 && (
            <div className="flex gap-3">
              {localized.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold">{localized.name}</h1>

          {localized.description && (
            <p className="text-gray-600 mt-4">{localized.description}</p>
          )}

          {localized.price && (
            <p className="text-2xl font-bold text-primary mt-6">
              ${localized.price}
            </p>
          )}
          <div className="mt-6">
            <p className="font-medium mb-2">
              {lang === "ar" ? "قيّم هذا المنتج" : "Rate this product"}
            </p>
            <StarRating
              onRate={handleRate}
              disabled={ratingLoading}
              value={userRating}
            />
            <div className="mt-4">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                placeholder={
                  lang === "ar"
                    ? "اكتب تعليقك هنا (اختياري)"
                    : "Write your review here (optional)"
                }
                className="w-full rounded-xl border px-4 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-primary
      dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
          </div>
          {localized.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t("Options")}</h3>
              <div className="flex gap-3 flex-wrap">
                {localized.variants.map((v) => (
                  <span
                    key={v.variantId}
                    className={`px-4 py-2 rounded-full border text-sm
                      ${!v.inStock ? "opacity-50 line-through" : ""}
                    `}
                  >
                    {Object.values(v.attributes).join(" / ")} – $
                    {v.variantPrice}
                  </span>
                ))}
              </div>
            </div>
          )}
          {localized.features && (
            <ul className="mt-8 space-y-3">
              {Object.entries(localized.features).map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between bg-gray-50 rounded-xl px-4 py-2"
                >
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
