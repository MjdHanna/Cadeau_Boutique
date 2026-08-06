import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineClock,
  HiCheck,
  HiX,
  HiOutlineUserAdd,
  HiOutlineUsers,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FriendCard = ({
  user,
  type = "friend",
  onRemove,
  onAccept,
  onReject,
  onCancel,
  onAdd,
  loading,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path || path === "null") {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User",
      )}`;
    }

    if (path.startsWith("http")) {
      return path;
    }

    return `https://cdb-back.bw-businessworld.net/${path}`;
  };

  const image = getImageUrl(user?.image || user?.profileImg);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-4 sm:p-5 lg:p-6"
    >
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 w-full">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={image}
              alt={user?.name || "User"}
              className="w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] min-h-[64px] sm:min-w-[80px] sm:min-h-[80px] rounded-[20px] sm:rounded-[24px] object-cover border border-gray-100 shadow-sm flex-shrink-0"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
          </div>


          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 break-words">
                {user?.name || t("Unknown User")}
              </h3>

              {user?.mutualFriendsCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/60 shadow-2xs">
                  <HiOutlineUsers className="w-3.5 h-3.5" />
                  {user.mutualFriendsCount} {t("mutual friends")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
              <HiOutlineMail className="shrink-0 text-gray-400" />
              <span className="truncate">{user?.email || t("No Email")}</span>
            </div>
          </div>
        </div>


        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto">

          {(type === "search" || type === "suggestion") && (
            <>
              {!user?.requestSent ? (
                <button
                  disabled={loading}
                  onClick={() => onAdd?.(user.id)}
                  className="h-11 sm:h-12 px-5 rounded-2xl bg-primary hover:opacity-90 text-white text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  <HiOutlineUserAdd size={18} />
                  {t("Add Friend")}
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => onCancel?.(user?.id)}
                  className="h-11 sm:h-12 px-5 rounded-2xl bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                >
                  <HiX size={18} />
                  {t("Cancel Request")}
                </button>
              )}
            </>
          )}
          {type === "friend" && (
            <>
              <button
                onClick={() => navigate(`/friends/${user.id}/wishlist`)}
                className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl bg-primary hover:opacity-90 text-white text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                🎁 {t("View Wishlist")}
              </button>

              <button
                disabled={loading}
                onClick={() => onRemove?.(user?.id)}
                className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
              >
                <HiOutlineTrash size={18} />
                {t("Remove")}
              </button>
            </>
          )}
          {type === "request" && (
            <>
              <button
                disabled={loading}
                onClick={() => onReject?.(user?.id)}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-red-50 hover:bg-red-500 hover:text-white text-red-500 flex items-center justify-center transition-all duration-300 disabled:opacity-50"
              >
                <HiX size={20} />
              </button>

              <button
                disabled={loading}
                onClick={() => onAccept?.(user?.id)}
                className="h-11 sm:h-12 px-5 rounded-2xl bg-primary hover:opacity-90 text-white text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-50"
              >
                <HiCheck size={18} />
                {t("Accept")}
              </button>
            </>
          )}
          {type === "sent" && (
            <button
              disabled={loading}
              onClick={() => onCancel?.(user?.id || user?.receiverId)}
              className="h-11 sm:h-12 px-5 rounded-2xl bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-sm sm:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
            >
              <HiOutlineClock size={18} />
              {t("Cancel")}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FriendCard;
