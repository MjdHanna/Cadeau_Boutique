import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useGetFriendsQuery } from "../../redux/features/apiSlice";
import MuiTextField from "../../components/form/MuiTextField/MuiTextField";
import CustomPhoneField from "../../components/form/MuiPhoneField/CustomPhoneField";
const RecipientSelector = ({ giftData, setGiftData }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const { data: friendsRes, isLoading } = useGetFriendsQuery();

  const getAvatar = (name = "User") => {
    const initial = name?.charAt(0)?.toUpperCase() || "U";

    return `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&size=128`;
  };
  const friends = useMemo(() => {
    if (!Array.isArray(friendsRes?.data)) return [];

    return friendsRes.data.map((item) => ({
      id: item.id,

      name: item.userName,

      email: item.userEmail,

      image: item.userImg || item.userprofileImg || item.profile_img || null,
    }));
  }, [friendsRes]);

  const selectedFriend = friends.find(
    (friend) => friend.id === giftData.friendId,
  );

  const handleRecipientType = (type) => {
    setGiftData((prev) => ({
      ...prev,

      recipientType: type,

      friendId: null,

      recipient: {
        name: "",
        phone: "",
        address: "",
      },
    }));
  };

  const selectFriend = (friend) => {
    setGiftData((prev) => ({
      ...prev,

      friendId: friend.id,
    }));
  };

  const updateRecipientField = (field, value) => {
    console.log(field, value);
    setGiftData((prev) => ({
      ...prev,

      recipient: {
        ...prev.recipient,
        [field]: value,
      },
    }));
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-2xl font-black">{t("Recipient")}</h3>

          <p className="text-gray-500 mt-1">
            {t("Choose who will receive this gift")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "self",

            title: t("Myself"),

            description: t("Send this order to your address"),
          },

          {
            id: "friend",

            title: t("Friend"),

            description: t("Choose from your friends"),
          },

          {
            id: "manual",

            title: t("Manual Recipient"),

            description: t("Enter recipient details manually"),
          },
        ].map((type) => {
          const active = giftData.recipientType === type.id;

          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={type.id}
              onClick={() => handleRecipientType(type.id)}
              className={`
                rounded-[28px]
                p-5
                border-2
                transition-all
                text-left
                ${
                  active
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-gray-200 bg-white"
                }
              `}
            >
              <h4 className="font-black text-lg mt-4">{type.title}</h4>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                {type.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {giftData.recipientType === "friend" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 space-y-4"
          >
            <h4 className="font-black text-lg">{t("Choose Friend")}</h4>

            {isLoading ? (
              <div className="text-gray-500">{t("Loading friends...")}</div>
            ) : friends.length === 0 ? (
              <div
                className="
                  rounded-[24px]
                  border
                  border-dashed
                  border-gray-300
                  p-6
                  text-center
                  text-gray-500
                  bg-gray-50
                "
              >
                {t("No friends found")}
              </div>
            ) : (
              friends.map((friend) => {
                const selected = giftData.friendId === friend.id;

                return (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={friend.id}
                    onClick={() => selectFriend(friend)}
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      p-4
                      rounded-[28px]
                      border-2
                      transition-all
                      ${
                        selected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-200 bg-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={friend.image || getAvatar(friend.name)}
                        alt={friend.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getAvatar(friend.name);
                        }}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h4 className="font-black text-lg">{friend.name}</h4>

                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>

                    {selected && (
                      <div
                        className="
                          w-8 h-8
                          rounded-full
                          bg-primary
                          text-white
                          flex items-center justify-center
                          font-black
                        "
                      >
                        ✓
                      </div>
                    )}
                  </motion.button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {giftData.recipientType === "manual" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 grid grid-cols-1 gap-4"
          >
            <MuiTextField
              formik={false}
              label={t("Recipient Full Name")}
              value={giftData.recipient?.name || ""}
              onChange={(e) => updateRecipientField("name", e.target.value)}
            />

            <MuiTextField
              formik={false}
              label={t("Recipient Address")}
              multiline
              rows={4}
              value={giftData.recipient?.address || ""}
              onChange={(e) => updateRecipientField("address", e.target.value)}
            />
            <CustomPhoneField
              label={t("Phone Number")}
              value={giftData.recipient?.phone || ""}
              onChange={(value) => updateRecipientField("phone", value || "")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {((giftData.recipientType === "friend" && selectedFriend) ||
          (giftData.recipientType === "manual" &&
            giftData.recipient?.name)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              mt-8
              rounded-[28px]
              bg-gradient-to-r
              from-primary/10
              to-pink-100
              p-5
            "
          >
            <h4 className="font-black text-lg mb-3">
              {t("Gift Recipient ✨")}
            </h4>

            {giftData.recipientType === "friend" && selectedFriend && (
              <div className="flex items-center gap-4">
                <img
                  src={selectedFriend.image || getAvatar(selectedFriend.name)}
                  alt={selectedFriend.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <p className="font-bold">{selectedFriend.name}</p>

                  <p className="text-sm text-gray-600">
                    {selectedFriend.email}
                  </p>
                </div>
              </div>
            )}

            {giftData.recipientType === "manual" && (
              <div className="space-y-1">
                <p className="font-bold">{giftData.recipient.name}</p>

                <p className="text-sm text-gray-600">
                  {giftData.recipient.phone}
                </p>

                <p className="text-sm text-gray-600">
                  {giftData.recipient.address}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipientSelector;
