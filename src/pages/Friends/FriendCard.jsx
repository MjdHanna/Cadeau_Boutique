import React from "react";
import { motion } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineClock,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const FriendCard = ({
  user,
  type = "friend",
  onRemove,
  onAccept,
  onReject,
  onCancel,
  loading,
}) => {
  const image =
    user?.image || user?.profileImg || "https://ui-avatars.com/api/?name=User";
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="
        relative overflow-hidden
        rounded-[32px]
        bg-white/80
        backdrop-blur-xl
        border border-white/20
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        p-5
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={image}
              alt={user?.name}
              className="
                w-20 h-20
                rounded-[24px]
                object-cover
                border border-gray-100
              "
            />

            <span
              className="
                absolute -bottom-1 -right-1
                w-5 h-5
                rounded-full
                border-[3px] border-white
                bg-green-500
              "
            />
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900">
              {user?.name || t("Unknown User")}
            </h3>

            <div className="flex items-center gap-2 mt-2 text-gray-500">
              <HiOutlineMail />

              <span className="text-sm">{user?.email || t("No Email")}</span>
            </div>

            {user?.birthDate && (
              <p className="text-xs text-gray-400 mt-2">{user.birthDate}</p>
            )}
          </div>
        </div>

        

        <div className="flex items-center gap-3 flex-wrap">
          {type === "friend" && (
            <button
              disabled={loading}
              onClick={() => onRemove(user?.id)}
              className="
                h-12 px-5
                rounded-2xl
                bg-red-50
                hover:bg-red-500
                hover:text-white
                text-red-500
                font-bold
                transition-all duration-300
                flex items-center gap-2
              "
            >
              <HiOutlineTrash size={18} />

              {t("Remove")}
            </button>
          )}

          {type === "request" && (
            <>
              <button
                disabled={loading}
                onClick={() => onReject(user?.id)}
                className="
                  h-12 w-12
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
                  h-12 px-5
                  rounded-2xl
                  bg-primary
                  hover:opacity-90
                  text-white
                  font-bold
                  transition-all duration-300
                  flex items-center gap-2
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
              onClick={() => onCancel(user?.id)}
              className="
                h-12 px-5
                rounded-2xl
                bg-gray-100
                hover:bg-black
                hover:text-white
                text-gray-700
                font-bold
                transition-all duration-300
                flex items-center gap-2
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
