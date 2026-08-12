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
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
  }, [id]);

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    let validFile = file;
    if (!file.type || !file.type.startsWith("image/")) {
      validFile = new File([file], file.name || "upload.jpg", {
        type: file.type || "image/jpeg",
      });
    }

    setImageFile(validFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(validFile);
  };

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
      setImagePreview(null);

      toast.success(t("Thanks for your rating ❤️"));
    } catch (err) {
      toast.error(err?.data?.message || t("Something went wrong"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loaderer />
      </div>
    );
  }
  if (error || !localized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <p className="text-xl font-bold text-red-500">
          {t("Failed to load product")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12 border border-gray-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              {localized.images.length > 0 ? (
                <div className="w-full h-80 md:h-[500px] bg-gray-50/80 rounded-3xl flex items-center justify-center overflow-hidden p-6 relative group">
                  <img
                    src={localized.images[activeImageIndex]}
                    alt={localized.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-full h-80 md:h-[500px] flex items-center justify-center bg-gray-50 rounded-3xl text-gray-400">
                  {t("No image available")}
                </div>
              )}

              {localized.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
                  {localized.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`
                        flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 transition-all duration-300
                        ${
                          activeImageIndex === i
                            ? "ring-2 ring-primary ring-offset-2 scale-105 bg-white shadow-md"
                            : "border border-gray-100 opacity-60 hover:opacity-100 hover:border-gray-300"
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                {product.brandNameEnglish && (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold mb-4 tracking-wide">
                    {isRTL ? product.brandNameArabic : product.brandNameEnglish}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                  {localized.name}
                </h1>
                {localized.description && (
                  <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                    {localized.description}
                  </p>
                )}
              </div>

              {localized.price && (
                <div className="mb-10">
                  <span className="text-4xl md:text-5xl font-black text-primary">
                    ${localized.price}
                  </span>
                </div>
              )}

              {localized.variants.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    {t("Options")}
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {localized.variants.map((v) => {
                      const attrs = isRTL ? v.attributesAr : v.attributesEn;
                      const isSelected = selectedVariant === v.variantId;
                      return (
                        <button
                          key={v.variantId}
                          disabled={!v.inStock}
                          onClick={() => setSelectedVariant(v.variantId)}
                          className={`
                            px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2
                            ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary shadow-sm"
                                : "border-gray-100 bg-white text-gray-600 hover:border-gray-300"
                            }
                            ${!v.inStock ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}
                          `}
                        >
                          {Object.values(attrs || {})
                            .map((val) =>
                              typeof val === "object"
                                ? JSON.stringify(val)
                                : val,
                            )
                            .join(" / ")}
                          <span className="mx-2 opacity-50">•</span>
                          {Number(v.variantPrice).toFixed(2)}$
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-gray-100">
                <AddToCartButton
                  productId={product.productId}
                  variantId={selectedVariant}
                  onSuccess={() => {
                    if (giftFriend) {
                      navigate("/cart", { state: { giftFriend } });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 space-y-8">
            {localized.features &&
              Object.keys(localized.features).length > 0 && (
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    {lang === "ar"
                      ? "المواصفات والمميزات"
                      : "Specifications & Features"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(localized.features).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50/80 rounded-2xl p-4 md:p-5 gap-2"
                      >
                        <span className="text-gray-500 font-medium text-sm">
                          {key}
                        </span>
                        <span className="text-gray-900 font-bold text-sm md:text-base text-right">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {vendor && (
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center shadow-inner p-2 border border-gray-100">
                      {vendor.shopLogo ? (
                        <img
                          src={vendor.shopLogo}
                          alt={vendor.shopNameEnglish}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-4xl">🏪</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                        {t("Sold By")}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900">
                        {isRTL ? vendor.shopNameArabic : vendor.shopNameEnglish}
                      </h3>
                      <div className="flex items-center gap-4 mt-3 text-sm font-semibold text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {vendor.products?.length || 0} {t("Products")}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>{vendor.shopPhoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {vendor.products?.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-6">
                      {t("More From This Store")}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vendor.products
                        .filter((p) => p.productId !== product.productId)
                        .slice(0, 4)
                        .map((item) => (
                          <div
                            key={item.productId}
                            onClick={() =>
                              navigate(`/products/${item.productId}`, {
                                state: { giftFriend },
                              })
                            }
                            className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer bg-white group"
                          >
                            <img
                              src={item.productImage}
                              alt={item.productNameEnglish}
                              className="w-20 h-20 rounded-xl object-contain bg-gray-50 p-2 group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <h5 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                {isRTL
                                  ? item.productNameArabic
                                  : item.productNameEnglish}
                              </h5>
                              <p className="text-primary font-black text-sm">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-24">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  {lang === "ar" ? "شاركنا تجربتك" : "Rate this product"}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {lang === "ar"
                    ? "رأيك يساعد الآخرين في اتخاذ القرار"
                    : "Your feedback helps others"}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center bg-gray-50 rounded-2xl p-4">
                  <StarRating
                    onRate={(val) => setUserRating(val)}
                    disabled={ratingLoading}
                    value={userRating}
                  />
                </div>

                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  placeholder={
                    lang === "ar"
                      ? "اكتب تعليقك هنا..."
                      : "Write your review..."
                  }
                  className="w-full rounded-2xl p-5 text-sm bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 resize-none shadow-inner"
                />

                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 rounded-2xl cursor-pointer transition-all group">
                    <svg
                      className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 transition-colors"
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
                    <span className="text-sm font-bold text-gray-500 group-hover:text-primary transition-colors">
                      {lang === "ar" ? "إرفاق صورة للمنتج" : "Attach Photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg, image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-gray-100 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition"
                      >
                        {lang === "ar" ? "حذف الصورة" : "Remove"}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmitRating}
                  disabled={ratingLoading}
                  className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
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
            </div>
          </div>
        </div>

        {product?.similarProducts && product.similarProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-200/60">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {lang === "ar" ? "منتجات مشابهة" : "Similar Products"}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {product.similarProducts.map((item) => (
                <div
                  key={item.productId}
                  onClick={() => {
                    navigate(`/products/${item.productId}`, {
                      state: { giftFriend },
                    });
                  }}
                  className="group cursor-pointer bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/20 transition-all duration-300 flex flex-col"
                >
                  <div className="w-full h-40 md:h-48 bg-gray-50 rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center p-4">
                    <img
                      src={item.image}
                      alt={isRTL ? item.productNameAr : item.productNameEn}
                      className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-1 mb-2">
                      {isRTL ? item.productNameAr : item.productNameEn}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">
                      {isRTL
                        ? item.productDescriptionAr
                        : item.productDescriptionEn}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                      <span className="font-black text-gray-900 text-lg md:text-xl">
                        ${Number(item.productPrice).toFixed(2)}
                      </span>
                      <button
                        className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                        aria-label="View Product"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
