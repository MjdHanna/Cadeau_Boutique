import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetProductByIdQuery,
  useAddProductRatingMutation,
  useGetVendorByIdQuery,
} from "../../redux/features/apiSlice";

import StarRating from "../../components/StarRating/StarRating";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import Loaderer from "../../views/Loader/Loader";
import { selectToken } from "../../redux/features/authSlice";
import { selectTranslate } from "../../redux/features/translateSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const giftFriend = location.state?.giftFriend;
  const { i18n, t } = useTranslation();

  const lang = useSelector(selectTranslate);
  const isRTL = i18n.language === "ar";
  const token = useSelector(selectToken);

  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const product = data?.data;
  const vendorId = product?.vendorId;

  const { data: vendorData } = useGetVendorByIdQuery(vendorId, {
    skip: !vendorId,
  });

  const vendor = vendorData?.data;

  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [addRating, { isLoading: ratingLoading }] =
    useAddProductRatingMutation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const variants = useMemo(() => {
    return Array.isArray(product?.variants) ? product.variants : [];
  }, [product]);

  useEffect(() => {
    if (variants.length === 1) {
      setSelectedVariant(variants[0].variantId);
    }
  }, [variants]);
  useEffect(() => {
    if (product?.userRating) {
      setUserRating(product.userRating);
    }
    if (product?.userReview) {
      setReview(product.userReview);
    }
  }, [product]);

  const localized = useMemo(() => {
    if (!product) return null;

    const featuresRaw = isRTL
      ? product.featuresArabic
      : product.featuresEnglish;

    return {
      name: isRTL ? product.productNameArabic : product.productNameEnglish,
      description: isRTL
        ? product.productDescriptionArabic
        : product.productDescriptionEnglish,
      features: featuresRaw || {},
      price: product.price,
      images: Array.isArray(product.images) ? product.images : [],
      variants,
    };
  }, [product, isRTL, variants]);

  const handleSubmitRating = async () => {
    if (!token) {
      toast.error(t("Please login to rate this product"));
      return;
    }

    if (!userRating) {
      toast.error(
        lang === "ar"
          ? "يرجى تحديد عدد النجوم أولاً"
          : "Please select a star rating first",
      );
      return;
    }

    try {
      await addRating({
        productId: id,
        rating: userRating,
        review: review.trim() || null,
        image: imageFile,
      }).unwrap();

      setImageFile(null);

      toast.success(t("Thanks for your rating ❤️"));
    } catch (err) {
      toast.error(err?.data?.message || t("Something went wrong"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loaderer />
      </div>
    );
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

          <div className="mt-8 p-6 rounded-3xl bg-slate-50/80 backdrop-blur-sm shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {lang === "ar" ? "شارِكنا رأيك" : "Rate this product"}
              </h3>
              <span className="text-xs text-gray-400">
                {lang === "ar" ? "تجربتك تهمنا" : "Your feedback matters"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-2xl w-fit shadow-xs">
              <StarRating
                onRate={(val) => setUserRating(val)}
                disabled={ratingLoading}
                value={userRating}
              />
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              placeholder={
                lang === "ar"
                  ? "اكتب تعليقك هنا حول المنتج..."
                  : "Write your review here..."
              }
              className="w-full rounded-2xl p-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition shadow-xs text-gray-700 placeholder-gray-400 resize-none"
            />
            <div className="space-y-2">
              {!imageFile ? (
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-gray-100/80 rounded-2xl cursor-pointer transition text-xs font-semibold text-gray-600 shadow-xs border-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {lang === "ar"
                      ? "إضافة صورة للتقييم"
                      : "Attach a Review Photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-white rounded-2xl shadow-xs">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-xl"
                    />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">
                      {imageFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition text-xs font-semibold"
                  >
                    {lang === "ar" ? "إزالة" : "Remove"}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmitRating}
              disabled={ratingLoading}
              className="w-full py-3 px-6 bg-primary text-white font-bold text-sm rounded-2xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition disabled:opacity-50"
            >
              {ratingLoading
                ? lang === "ar"
                  ? "جاري الإرسال..."
                  : "Submitting..."
                : lang === "ar"
                  ? "إرسال التقييم"
                  : "Submit Rating"}
            </button>
          </div>
          {localized.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">{t("Options")}</h3>

              <div className="flex gap-3 flex-wrap">
                {localized.variants.map((v) => {
                  const attrs = isRTL ? v.attributesAr : v.attributesEn;

                  return (
                    <button
                      key={v.variantId}
                      disabled={!v.inStock}
                      onClick={() => setSelectedVariant(v.variantId)}
                      className={`px-4 py-2 rounded-full border text-sm transition
                        ${
                          selectedVariant === v.variantId
                            ? "bg-primary text-white"
                            : "bg-white"
                        }
                        ${!v.inStock ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {Object.values(attrs || {})
                        .map((val) =>
                          typeof val === "object" ? JSON.stringify(val) : val,
                        )
                        .join(" / ")}
                      {" - "}
                      {Number(v.variantPrice).toFixed(2)}$
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {vendor && (
            <div className="mt-10 rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border">
                    {vendor.shopLogo ? (
                      <img
                        src={vendor.shopLogo}
                        alt={vendor.shopNameEnglish}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">🏪</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black">
                      {isRTL ? vendor.shopNameArabic : vendor.shopNameEnglish}
                    </h3>

                    <p className="text-gray-500 mt-1 max-w-md">
                      {isRTL
                        ? vendor.shopDescriptionArabic ||
                          vendor.shopDescriptionEnglish
                        : vendor.shopDescriptionEnglish}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                      <span>📞 {vendor.shopPhoneNumber}</span>
                      <span>•</span>
                      <span>
                        {vendor.products?.length || 0} {t("Products")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {vendor.products?.length > 0 && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-xl font-black">
                      {t("More From This Store")}
                    </h4>

                    <span className="text-sm text-gray-400">
                      {vendor.products.length} {t("items")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vendor.products
                      .filter((p) => p.productId !== product.productId)
                      .slice(0, 4)
                      .map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-4 rounded-2xl border border-gray-100 p-3 hover:shadow-md transition"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productNameEnglish}
                            className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                          />

                          <div className="flex-1">
                            <h5 className="font-bold line-clamp-2">
                              {isRTL
                                ? item.productNameArabic
                                : item.productNameEnglish}
                            </h5>

                            <p className="text-primary font-black mt-2">
                              ${item.price}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {isRTL
                                ? item.brandNameArabic
                                : item.brandNameEnglish}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <AddToCartButton
            productId={product.productId}
            variantId={selectedVariant}
            onSuccess={() => {
              if (giftFriend) {
                navigate("/cart", {
                  state: { giftFriend },
                });
              }
            }}
          />
          {localized.features && (
            <ul className="mt-8 space-y-3">
              {Object.entries(localized.features).map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between bg-gray-50 rounded-xl px-4 py-2"
                >
                  <span className="font-medium">{key}</span>
                  <span>
                    {typeof value === "object" ? JSON.stringify(value) : value}
                  </span>
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
