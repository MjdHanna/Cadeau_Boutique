import React, { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectToken } from "../../redux/features/authSlice";

import {
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useGetPeopleYouMayKnowQuery,
  useAcceptFriendMutation,
  useRejectFriendMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
  useSearchUsersQuery,
  useAddFriendMutation,
} from "../../redux/features/apiSlice";

import FriendCard from "./FriendCard";
import EmptyState from "./EmptyState";
import FriendsSkeleton from "./FriendsSkeleton";

const LoginRequired = lazy(
  () => import("../../components/LoginRequired/LoginRequired"),
);

const tabs = [
  {
    id: "friends",
    label: "Friends",
    icon: HiOutlineUsers,
  },
  {
    id: "suggestions",
    label: "People You May Know",
    icon: HiOutlineSparkles,
  },
  {
    id: "requests",
    label: "Requests",
    icon: HiOutlineUserAdd,
  },
  {
    id: "sent",
    label: "Sent",
    icon: HiOutlinePaperAirplane,
  },
];

const Friends = () => {
  const token = useSelector(selectToken);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("friends");
  const [search, setSearch] = useState("");
  const [localSearchUsers, setLocalSearchUsers] = useState([]);

  const { data: searchRes, isLoading: searchLoading } = useSearchUsersQuery(
    search,
    {
      skip: !token || search.trim().length < 2,
    },
  );

  const searchedUsers = useMemo(() => {
    if (!Array.isArray(searchRes?.data)) return [];

    return searchRes.data.map((item) => ({
      id: item.id,
      name: item.userName,
      email: item.userEmail,
      image:
        item.userprofileImg ||
        item.userImg ||
        item.profileImg ||
        item.profile_img,
      requestSent: item.requestSent,
      requestId: item.requestId,
    }));
  }, [searchRes]);

  useEffect(() => {
    if (searchedUsers.length > 0) {
      setLocalSearchUsers(searchedUsers);
    } else {
      setLocalSearchUsers([]);
    }
  }, [searchedUsers]);

  const { data: friendsRes, isLoading: friendsLoading } = useGetFriendsQuery(
    undefined,
    {
      skip: !token,
    },
  );
  const { data: suggestionsRes, isLoading: suggestionsLoading } =
    useGetPeopleYouMayKnowQuery(undefined, {
      skip: !token,
    });

  const { data: requestsRes, isLoading: requestsLoading } =
    useGetPendingRequestsQuery(undefined, {
      skip: !token,
    });

  const { data: sentRes, isLoading: sentLoading } = useGetSentRequestsQuery(
    undefined,
    {
      skip: !token,
    },
  );

  const [addFriend] = useAddFriendMutation();
  const [acceptFriend, { isLoading: acceptLoading }] =
    useAcceptFriendMutation();
  const [rejectFriend, { isLoading: rejectLoading }] =
    useRejectFriendMutation();
  const [cancelRequest, { isLoading: cancelLoading }] =
    useCancelFriendRequestMutation();
  const [removeFriend, { isLoading: removeLoading }] =
    useRemoveFriendMutation();

  const friends = useMemo(() => {
    if (!Array.isArray(friendsRes?.data)) return [];

    return friendsRes.data.map((item) => ({
      id: item.id,
      name: item.userName,
      email: item.userEmail,
      image: item.userImg,
      birthDate: item.userBirthDate,
    }));
  }, [friendsRes]);

  const suggestedUsers = useMemo(() => {
    if (!Array.isArray(suggestionsRes?.data)) return [];
    const currentFriendIds = Array.isArray(friendsRes?.data)
      ? friendsRes.data.map((f) => f.id)
      : [];

    return suggestionsRes.data
      .filter((item) => !currentFriendIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        name: item.userName || item.name,
        email: item.userEmail || item.email,
        image: item.userImg || item.profileImg,
        mutualFriendsCount:
          item.mutualFriendsCount || item.mutual_friends_count || 0,
        requestSent: item.requestSent || false,
      }));
  }, [suggestionsRes, friendsRes]);

  const requests = useMemo(() => {
    if (!Array.isArray(requestsRes?.data)) return [];

    return requestsRes.data.map((item) => ({
      id: item.id,
      senderId: item.senderId,
      name: item.senderName,
      email: item.senderEmail,
      image: item.senderProfilImg,
      reqStatus: item.reqStatus,
    }));
  }, [requestsRes]);

  const sentRequests = useMemo(() => {
    if (!Array.isArray(sentRes?.data)) return [];

    return sentRes.data.map((item) => ({
      id: item.id,
      receiverId: item.receiverId,
      name: item.receiverName,
      email: item.receiverEmail,
      image: item.receiverProfilImg,
      reqStatus: item.reqStatus,
    }));
  }, [sentRes]);

  const filterUsers = (users) => {
    return users.filter((user) =>
      user?.name?.toLowerCase()?.includes(search.toLowerCase()),
    );
  };

  if (!token) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginRequired
          message={t("Please login to access friends")}
          redirectTo="/login"
          buttonText={t("Login")}
        />
      </Suspense>
    );
  }

  const loading =
    friendsLoading || requestsLoading || sentLoading || suggestionsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f4f7fb] to-[#eef2ff] py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900">
              {t("Friends")}
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              {t("Manage your friendships and requests")}
            </p>
          </div>

          <div className="relative w-full xl:w-[340px]">
            <HiOutlineSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("Search users...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full rounded-[24px] border border-white/20 bg-white/80 backdrop-blur-xl pl-14 pr-5 outline-none shadow-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="mb-10">
          {search.trim().length >= 2 && (
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-5">{t("Search Results")}</h2>

              <div className="w-full space-y-4">
                {searchLoading ? (
                  <FriendsSkeleton />
                ) : localSearchUsers.length > 0 ? (
                  localSearchUsers.map((user) => (
                    <FriendCard
                      key={user.id}
                      user={user}
                      type="search"
                      t={t}
                      onAdd={async (id) => {
                        try {
                          const res = await addFriend(id).unwrap();
                          setLocalSearchUsers((prev) =>
                            prev.map((u) =>
                              u.id === id
                                ? {
                                    ...u,
                                    requestSent: true,
                                    requestId: res?.requestId,
                                  }
                                : u,
                            ),
                          );
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      onCancel={async (userId) => {
                        try {
                          await cancelRequest(userId).unwrap();
                          setLocalSearchUsers((prev) =>
                            prev.map((u) =>
                              u.id === userId
                                ? { ...u, requestSent: false, requestId: null }
                                : u,
                            ),
                          );
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />
                  ))
                ) : (
                  <EmptyState
                    title={t("No Users Found")}
                    description={t("Try another name")}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-14 px-6 rounded-[22px] font-bold flex items-center gap-3 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white/70 text-gray-600 hover:bg-white"
                }`}
              >
                <Icon size={20} />
                {t(tab.label)}
              </button>
            );
          })}
        </div>
        {loading ? (
          <FriendsSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              {activeTab === "friends" && (
                <>
                  {filterUsers(friends).length > 0 ? (
                    filterUsers(friends).map((friend) => (
                      <FriendCard
                        key={friend.id}
                        user={friend}
                        type="friend"
                        loading={removeLoading}
                        onRemove={async (id) => {
                          try {
                            await removeFriend(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={t("No Friends Yet")}
                      description={t("You don't have any friends right now.")}
                    />
                  )}
                </>
              )}
              {activeTab === "suggestions" && (
                <>
                  {filterUsers(suggestedUsers).length > 0 ? (
                    filterUsers(suggestedUsers).map((user) => (
                      <FriendCard
                        key={user.id}
                        user={user}
                        type="suggestion"
                        onAdd={async (id) => {
                          try {
                            await addFriend(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        onCancel={async (id) => {
                          try {
                            await cancelRequest(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={t("No Suggestions Available")}
                      description={t(
                        "Check back later for new friend suggestions.",
                      )}
                    />
                  )}
                </>
              )}
              {activeTab === "requests" && (
                <>
                  {filterUsers(requests).length > 0 ? (
                    filterUsers(requests).map((request) => (
                      <FriendCard
                        key={request.id}
                        user={request}
                        type="request"
                        loading={acceptLoading || rejectLoading}
                        onAccept={async (id) => {
                          try {
                            await acceptFriend(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        onReject={async (id) => {
                          try {
                            await rejectFriend(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={t("No Requests")}
                      description={t("You don't have pending requests.")}
                    />
                  )}
                </>
              )}
              {activeTab === "sent" && (
                <>
                  {filterUsers(sentRequests).length > 0 ? (
                    filterUsers(sentRequests).map((request) => (
                      <FriendCard
                        key={request.id}
                        user={request}
                        type="sent"
                        loading={cancelLoading}
                        onCancel={async (id) => {
                          try {
                            await cancelRequest(id).unwrap();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={t("No Sent Requests")}
                      description={t("You have not sent any requests yet.")}
                    />
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Friends;
