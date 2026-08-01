import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineGift, HiOutlineHeart } from "react-icons/hi";
import { useTranslation } from "react-i18next";

import { useGetFriendWishlistQuery } from "../../redux/features/apiSlice";
import Loaderer from "../../views/Loader/Loader";
const FriendWishlist = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const { data, isLoading } = useGetFriendWishlistQuery(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loaderer />
      </div>
    );
  }

  const friend = data?.data?.friend;

  const wishlist = data?.data?.wishlist || [];

  const profileImage =
    friend?.profileImg || `https://ui-avatars.com/api/?name=${friend?.name}`;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#f8fafc]
        via-[#f4f7fb]
        to-[#eef2ff]
        py-28
        px-4
      "
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
    relative overflow-hidden
    rounded-3xl sm:rounded-[40px]
    bg-white/70
    backdrop-blur-xl
    border border-white/20
    shadow-[0_20px_80px_rgba(0,0,0,0.08)]
    p-5 sm:p-8 md:p-12
    mb-8 sm:mb-12
  "
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center text-center sm:text-start gap-4 sm:gap-6">
              <img
                src={profileImage}
                alt={friend?.name}
                className="
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
          rounded-2xl sm:rounded-[32px]
          object-cover
          border-2 sm:border-4 border-white
          shadow-xl
          shrink-0
        "
              />

              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  {friend?.name}
                </h1>

                <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg max-w-xl">
                  {t("Send a thoughtful gift from their wishlist")} 🎁
                </p>

                <div className="flex items-center gap-3 mt-4 sm:mt-5">
                  <div
                    className="
              px-3 py-1.5 sm:px-4 sm:py-2
              rounded-xl sm:rounded-2xl
              bg-primary/10
              text-primary
              text-xs sm:text-sm md:text-base
              font-bold
            "
                  >
                    {wishlist.length} {t("Wishlist Items")}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="
        hidden lg:flex
        w-28 h-28 md:w-32 md:h-32
        rounded-full
        bg-primary/10
        items-center justify-center
        shrink-0
      "
            >
              <HiOutlineGift className="text-primary" size={50} />
            </div>
          </div>
        </motion.div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[32px]
                  bg-white/80
                  backdrop-blur-xl
                  border border-white/20
                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                "
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.productImage}
                    alt={isRTL ? item.nameAr : item.nameEn}
                    className="
                      w-full h-72
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />

                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-t
                      from-black/50
                      to-transparent
                    "
                  />
                </div>
                <div className="p-6">
                  <h2
                    className="
                      text-2xl
                      font-black
                      text-gray-900
                      line-clamp-1
                    "
                  >
                    {isRTL ? item.nameAr : item.nameEn}
                  </h2>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-3xl font-black text-primary">
                      ${item.productPrice}
                    </p>

                    <div
                      className="
                        px-3 py-1
                        rounded-full
                        bg-primary/10
                        text-primary
                        text-sm
                        font-bold
                      "
                    >
                      {t("Wanted")}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/products/${item.productId}`, {
                        state: {
                          giftFriend: friend,
                        },
                      })
                    }
                    className="
                      mt-6
                      w-full
                      h-14
                      rounded-2xl
                      bg-primary
                      hover:scale-[1.02]
                      active:scale-[0.98]
                      text-white
                      font-black
                      text-lg
                      transition-all duration-300
                      shadow-lg shadow-primary/30
                    "
                  >
                    {t("Gift This Product")} 🎁
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="
              bg-white/80
              backdrop-blur-xl
              rounded-[32px]
              p-16
              text-center
              shadow-sm
            "
          >
            <h2 className="text-3xl font-black text-gray-800">
              {t("Wishlist is empty")}
            </h2>

            <p className="text-gray-500 mt-3">
              {t("This friend has not added products yet")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendWishlist;
