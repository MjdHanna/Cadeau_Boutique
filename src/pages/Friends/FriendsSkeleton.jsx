import React from "react";
import { selectTranslate } from "../../redux/features/translateSlice";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const FriendsSkeleton = () => {
  const lang = useSelector(selectTranslate);
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="
            animate-pulse
            rounded-[32px]
            bg-white
            border border-gray-100
            p-5
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-[24px] bg-gray-200" />

              <div>
                <div className="w-40 h-5 rounded bg-gray-200 mb-3" />

                <div className="w-52 h-4 rounded bg-gray-100" />
              </div>
            </div>

            <div className="w-28 h-12 rounded-2xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsSkeleton;
