import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const followers = [
  {
    id: 1,
    name: "Sarah Johnson",
    username: "@sarahj",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Ahmed Ali",
    username: "@ahmedali",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Emily Rose",
    username: "@emilyrose",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const RecipientSelector = ({ giftData, setGiftData }) => {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";
  const handleRecipientType = (type) => {
    setGiftData((prev) => ({
      ...prev,
      recipientType: type,
      selectedFollower: null,
      recipient: {
        name: "",
        phone: "",
        address: "",
      },
    }));
  };

  const selectFollower = (friend) => {
    setGiftData((prev) => ({
      ...prev,
      selectedFollower: friend,
    }));
  };

  const updateRecipientField = (field, value) => {
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

      {/* Recipient Types */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: "self",
            title: "Myself",
            description: "Send this order to your address",
            emoji: "🙋‍♂️",
          },
          {
            id: "friend",
            title: "Follower",
            description: "Choose from your followers",
            emoji: "👥",
          },
          {
            id: "custom",
            title: "Custom Person",
            description: "Enter recipient details manually",
            emoji: "🎯",
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
              <div className="text-3xl">{type.emoji}</div>

              <h4 className="font-black text-lg mt-4">{type.title}</h4>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                {type.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Followers List */}

      {giftData.recipientType === "friend" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-4"
        >
          <h4 className="font-black text-lg">{t("Choose Follower")}</h4>

          {followers.map((friend) => {
            const selected = giftData.selectedFollower?.id === friend.id;

            return (
              <button
                key={friend.id}
                onClick={() => selectFollower(friend)}
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
                    selected ? "border-primary bg-primary/5" : "border-gray-200"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="text-left">
                    <h4 className="font-black">{friend.name}</h4>

                    <p className="text-sm text-gray-500">{friend.username}</p>
                  </div>
                </div>

                {selected && (
                  <div
                    className="w-7 h-7 rounded-full
                    bg-primary text-white
                    flex items-center justify-center"
                  >
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* Custom Recipient */}

      {giftData.recipientType === "custom" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 grid grid-cols-1 gap-4"
        >
          <input
            type="text"
            placeholder="Recipient Full Name"
            value={giftData.recipient?.name || ""}
            onChange={(e) => updateRecipientField("name", e.target.value)}
            className="
              w-full
              rounded-[24px]
              border
              border-gray-200
              p-4
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={giftData.recipient?.phone || ""}
            onChange={(e) => updateRecipientField("phone", e.target.value)}
            className="
              w-full
              rounded-[24px]
              border
              border-gray-200
              p-4
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />

          <textarea
            rows={4}
            placeholder="Recipient Address"
            value={giftData.recipient?.address || ""}
            onChange={(e) => updateRecipientField("address", e.target.value)}
            className="
              w-full
              rounded-[24px]
              border
              border-gray-200
              p-4
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />
        </motion.div>
      )}

      {/* Selected Recipient Preview */}

      {(giftData.recipientType === "friend" && giftData.selectedFollower) ||
      (giftData.recipientType === "custom" && giftData.recipient?.name) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            mt-8
            rounded-[28px]
            bg-gradient-to-r
            from-primary/10
            to-pink-100
            p-5
          "
        >
          <h4 className="font-black text-lg mb-2">{t("Gift Recipient ✨")}</h4>

          {giftData.recipientType === "friend" && (
            <div>
              <p className="font-bold">{giftData.selectedFollower.name}</p>

              <p className="text-sm text-gray-600">
                {giftData.selectedFollower.username}
              </p>
            </div>
          )}

          {giftData.recipientType === "custom" && (
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
      ) : null}
    </div>
  );
};

export default RecipientSelector;
