import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineClock,
  HiCheck,
  HiX,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path || path === "null") {
      return `https://ui-avatars.com/api/?name=${user?.name || "User"}`;
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
      className="
    relative overflow-hidden
    rounded-[28px] sm:rounded-[32px]
    bg-white/80
    backdrop-blur-xl
    border border-white/20
    shadow-[0_10px_40px_rgba(0,0,0,0.06)]
    p-4 sm:p-5 lg:p-6
  "
    >
      <div
        className="
      flex flex-col xl:flex-row
      xl:items-center
      xl:justify-between
      gap-5
      w-full
    "
      >
        <div
          className="
        flex items-center
        gap-3 sm:gap-4
        min-w-0
        flex-1
      "
        >
          <div className="relative flex-shrink-0">
            <img
              src={image}
              alt={user?.name}
              className="
            w-16 h-16
            sm:w-20 sm:h-20
            min-w-[64px] min-h-[64px]
            sm:min-w-[80px] sm:min-h-[80px]
            rounded-[20px] sm:rounded-[24px]
            object-cover
            border border-gray-100
            shadow-sm
            flex-shrink-0
          "
            />

            <span
              className="
            absolute
            -bottom-1 -right-1
            w-4 h-4
            rounded-full
            border-2 border-white
            bg-green-500
          "
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="
      text-lg sm:text-xl
      font-black
      text-gray-900
      break-words
    "
            >
              {user?.name || t("Unknown User")}
            </h3>

            <div
              className="
      flex items-start
      gap-2
      mt-2
      text-gray-500
    "
            >
              <HiOutlineMail className="shrink-0 mt-1" />

              <span
                className="
        text-sm
        break-all
      "
              >
                {user?.email || t("No Email")}
              </span>
            </div>

            {/* {user?.birthDate && (
              <p
                className="
        text-xs
        text-gray-400
        mt-2
        break-words
      "
              >
                {user.birthDate}
              </p>
            )} */}
          </div>
        </div>
        <div
          className="
        flex flex-wrap
        items-center
        gap-2 sm:gap-3
        w-full xl:w-auto
      "
        >
          {type === "search" && (
            <>
              {!user?.requestSent ? (
                <button
                  disabled={loading}
                  onClick={() => onAdd(user.id)}
                  className="
                h-11 sm:h-12
                px-4 sm:px-5
                rounded-2xl
                bg-primary
                hover:opacity-90
                text-white
                text-sm sm:text-base
                font-bold
                transition-all duration-300
                flex items-center justify-center gap-2
                w-full sm:w-auto
              "
                >
                  <HiOutlineUserAdd />

                  {t("Add Friend")}
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => onCancel(user?.id)}
                  className="
                h-11 sm:h-12
                px-4 sm:px-5
                rounded-2xl
                bg-gray-100
                hover:bg-red-500
                hover:text-white
                text-gray-700
                text-sm sm:text-base
                font-bold
                transition-all duration-300
                flex items-center justify-center gap-2
                w-full sm:w-auto
              "
                >
                  <HiX />

                  {t("Cancel Request")}
                </button>
              )}
            </>
          )}

          {type === "friend" && (
            <>
              <button
                onClick={() => navigate(`/friends/${user.id}/wishlist`)}
                className="
        h-11 sm:h-12
        px-4 sm:px-5
        rounded-2xl
        bg-primary
        hover:opacity-90
        text-white
        text-sm sm:text-base
        font-bold
        transition-all duration-300
        flex items-center justify-center gap-2
        w-full sm:w-auto
      "
              >
                🎁 {t("View Wishlist")}
              </button>

              <button
                disabled={loading}
                onClick={() => onRemove(user?.id)}
                className="
        h-11 sm:h-12
        px-4 sm:px-5
        rounded-2xl
        bg-red-50
        hover:bg-red-500
        hover:text-white
        text-red-500
        text-sm sm:text-base
        font-bold
        transition-all duration-300
        flex items-center justify-center gap-2
        w-full sm:w-auto
      "
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
                onClick={() => onReject(user?.id)}
                className="
              h-11 w-11
              sm:h-12 sm:w-12
              rounded-2xl
              bg-red-50
              hover:bg-red-500
              hover:text-white
              text-red-500
              flex items-center justify-center
              transition-all duration-300
            "
              >
                <HiX size={20} />
              </button>

              <button
                disabled={loading}
                onClick={() => onAccept(user?.id)}
                className="
              h-11 sm:h-12
              px-4 sm:px-5
              rounded-2xl
              bg-primary
              hover:opacity-90
              text-white
              text-sm sm:text-base
              font-bold
              transition-all duration-300
              flex items-center justify-center gap-2
              flex-1 sm:flex-none
            "
              >
                <HiCheck />

                {t("Accept")}
              </button>
            </>
          )}

          {type === "sent" && (
            <button
              disabled={loading}
              onClick={() => onCancel(user?.receiverId)}
              className="
            h-11 sm:h-12
            px-4 sm:px-5
            rounded-2xl
            bg-gray-100
            hover:bg-black
            hover:text-white
            text-gray-700
            text-sm sm:text-base
            font-bold
            transition-all duration-300
            flex items-center justify-center gap-2
            w-full sm:w-auto
          "
            >
              <HiOutlineClock />

              {t("Cancel")}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FriendCard;
