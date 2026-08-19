import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "./authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cdb-back.bw-businessworld.net/api",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = getState().auth.token;
      const protectedEndpoints = [
        "getProfile",
        "deleteProfileImg",
        "getUser",
        "getMyFollowedBrands",
        "editProfile",
        "logout",
        "getWishlist",
        "addToWishlist",
        "removeFromWishlist",
        "accountDelete",
        "addProductRating",
        "contactUs",
        "getCart",
        "addToCart",
        "removeFromCart",
        "getGiftWrappers",
        "getOrders",
        "getOrderHistory",
        "cancelOrder",
        "checkout",
        "getFriends",
        "getPendingRequests",
        "getSentRequests",
        "addFriend",
        "acceptFriend",
        "rejectFriend",
        "cancelFriendRequest",
        "removeFriend",
        "searchUsers",
        "followBrand",
        "unfollowBrand",
        "isFollowingBrand",
        "onlyForYou",
        "getFriendWishlist",
        "getReceivedGiftCards",
        "getReceivedGiftCardById",
        "getSentGiftCards",
        "createGiftCard",
        "redeemGiftCard",
        "getCoupons",
        "saveFcmToken",
        "getNotifications",
        "markNotificationAsRead",
        "calculateOrderPrice",
      ];
      if (token && protectedEndpoints.includes(endpoint)) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Wishlist",
    "Cart",
    "Orders",
    "Friends",
    "Brands",
    "GiftCards",
    "Notifications",
  ],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "email-verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    googleMe: builder.query({
      query: () => ({
        url: "auth/google/me",
        method: "GET",
        credentials: "include",
      }),
    }),
    accountDelete: builder.mutation({
      query: (data) => ({
        url: "account-removal",
        method: "DELETE",
        body: data,
      }),
    }),

    // Profile
    getUser: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    editProfile: builder.mutation({
      query: (data) => {
        const formData = new FormData();

        formData.append("userName", data.name || "");
        formData.append("email", data.email || "");
        formData.append("gender", data.gender || "");
        formData.append("birthDate", data.birthDate || "");
        formData.append("phoneNumber", data.phone_number || "");
        formData.append("address", data.address || "");
        formData.append("bio", data.bio || "");

        if (data.profileImg) {
          formData.append("profileImg", data.profileImg);
        }

        return {
          url: "account-edit",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Auth"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const updatedUser = data?.data || data?.user || data;
          dispatch(setUser(updatedUser));
        } catch (e) {
          console.error(e);
        }
      },
    }),
    deleteProfileImg: builder.mutation({
      query: () => ({
        url: "account-remove-profile-img",
        method: "DELETE",
      }),

      invalidatesTags: ["Auth"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const updatedUser = data?.data || data?.user || data;
          dispatch(setUser(updatedUser));
        } catch (e) {
          console.error(e);
        }
      },
    }),
    getMyFollowedBrands: builder.query({
      query: () => ({
        url: "Brands/my-follows",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),

    // Reset Flow
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "send-reset-code",
        method: "POST",
        body: { email },
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "resend-otp",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({ url: "reset-password", method: "POST", body: data }),
    }),

    logout: builder.mutation({
      query: () => ({ url: "logout", method: "DELETE" }),
    }),
    // ContactUs
    contactUs: builder.mutation({
      query: (data) => ({
        url: "contact-us",
        method: "POST",
        body: data,
      }),
    }),
    // Filter
    getFilteredProducts: builder.query({
      query: (filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        return `products/filter?${params.toString()}`;
      },
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    // Brands & Categories & Occasions
    getBrands: builder.query({ query: () => "brands" }),
    getBrandById: builder.query({ query: (id) => `brands/${id}` }),
    followBrand: builder.mutation({
      query: (brandId) => ({
        url: `brands/${brandId}/follow`,
        method: "POST",
      }),
      invalidatesTags: (result, error, brandId) => [
        { type: "Brands", id: brandId },
      ],
    }),

    unfollowBrand: builder.mutation({
      query: (brandId) => ({
        url: `brands/${brandId}/unfollow`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, brandId) => [
        { type: "Brands", id: brandId },
      ],
    }),

    isFollowingBrand: builder.query({
      query: (brandId) => ({
        url: `brands/${brandId}/is-following`,
        method: "GET",
      }),
      providesTags: (result, error, brandId) => [
        { type: "Brands", id: brandId },
      ],
    }),
    getCategories: builder.query({ query: () => "categories" }),
    getCategoryById: builder.query({ query: (id) => `categories/${id}` }),
    getOccasions: builder.query({ query: () => "occasions" }),
    getOccasionsById: builder.query({ query: (id) => `occasions/${id}` }),
    getProducts: builder.query({ query: () => "products" }),
    getProductById: builder.query({ query: (id) => `products/${id}` }),
    getLatestProducts: builder.query({ query: () => "latest-products" }),
    getVendorById: builder.query({
      query: (vendorId) => `products-by-vendor/${vendorId}`,
    }),
    onlyForYou: builder.query({
      query: () => ({
        url: "only-for-you",
        method: "GET",
      }),
    }),
    // Rating
    addProductRating: builder.mutation({
      query: ({ productId, rating, review, image }) => {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("rating", rating);
        if (review) formData.append("review", review);
        if (image) formData.append("image", image);
        return {
          url: "/rating",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),

    // Wishlist
    getWishlist: builder.query({
      query: () => ({ url: "wishlist", method: "GET" }),
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: "wishlist/add",
        method: "POST",
        body: { productId: Number(productId) },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: ({ productId }) => ({
        url: "wishlist/remove",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: { productId: Number(productId) },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getFriendWishlist: builder.query({
      query: (friendId) => ({
        url: `friends/${friendId}/wishlist`,
        method: "GET",
      }),
    }),
    getPeopleYouMayKnow: builder.query({
      query: () => ({
        url: "/friends/peopleYouMayKnow",
        method: "GET",
      }),
      providesTags: ["Friends", "Requests"],
    }),
    // Cart
    getCart: builder.query({
      query: () => ({
        url: "cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: "cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "cart/remove",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    getGiftWrappers: builder.query({
      query: () => ({
        url: "gift-wrappers",
        method: "GET",
      }),
    }),
    getCoupons: builder.query({
      query: () => ({
        url: "coupons",
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),

    // Orders
    getOrders: builder.query({
      query: () => ({
        url: "orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getOrderHistory: builder.query({
      query: () => ({
        url: "orders/history",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),

    checkout: builder.mutation({
      query: (data) => ({
        url: "checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart", "Orders", "Auth"],
    }),

    // Friends
    getFriends: builder.query({
      query: () => ({
        url: "friends",
        method: "GET",
      }),
      providesTags: ["Friends"],
    }),

    getPendingRequests: builder.query({
      query: () => ({
        url: "friends/incoming-requests",
        method: "GET",
      }),
      providesTags: ["Friends"],
    }),

    getSentRequests: builder.query({
      query: () => ({
        url: "friends/sent-requests",
        method: "GET",
      }),
      providesTags: ["Friends"],
    }),

    addFriend: builder.mutation({
      query: (userId) => ({
        url: `friends/${userId}/request`,
        method: "POST",
      }),
      invalidatesTags: ["Friends"],
    }),

    acceptFriend: builder.mutation({
      query: (requestId) => ({
        url: `friends/request/${requestId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Friends"],
    }),

    rejectFriend: builder.mutation({
      query: (requestId) => ({
        url: `friends/request/${requestId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Friends"],
    }),

    cancelFriendRequest: builder.mutation({
      query: (requestId) => ({
        url: `friends/${requestId}/cancel`,
        method: "DELETE",
      }),
      invalidatesTags: ["Friends"],
    }),

    removeFriend: builder.mutation({
      query: (friendId) => ({
        url: `friends/${friendId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Friends"],
    }),

    searchUsers: builder.query({
      query: (name) => ({
        url: `users/filter?name=${name}`,
        method: "GET",
      }),
      providesTags: ["Friends"],
    }),

    // Gift-Card
    getReceivedGiftCards: builder.query({
      query: () => ({
        url: "received-gift-card",
        method: "GET",
      }),
      providesTags: ["GiftCards"],
    }),
    getReceivedGiftCardById: builder.query({
      query: (id) => `received-gift-card/${id}`,
      providesTags: ["GiftCards"],
    }),
    getSentGiftCards: builder.query({
      query: () => ({
        url: "sent-gift-card",
        method: "GET",
      }),
      providesTags: ["GiftCards"],
    }),

    createGiftCard: builder.mutation({
      query: (data) => ({
        url: "create-gift-card",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GiftCards"],
    }),

    redeemGiftCard: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/redeem-gift-card/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GiftCards", "Orders"],
    }),

    // End GiftCards

    // Ads Endpoints
    getAds: builder.query({
      query: () => "adds",
    }),
    getAdById: builder.query({
      query: (id) => `adds/${id}`,
    }),
    //End Adds

    // Notifications Endpoints
    saveFcmToken: builder.mutation({
      query: (fcmToken) => ({
        url: "save-fcm-token",
        method: "POST",
        body: { fcmToken },
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: "notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/mark-as-read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),
    // Calculate_Price
    calculateOrderPrice: builder.mutation({
      query: (data) => ({
        url: "calculate-order-price",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calculate"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useAccountDeleteMutation,
  useGetUserQuery,
  useEditProfileMutation,
  useDeleteProfileImgMutation,
  useGetMyFollowedBrandsQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useResendOtpMutation,
  useGetFilteredProductsQuery,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useFollowBrandMutation,
  useUnfollowBrandMutation,
  useIsFollowingBrandQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetLatestProductsQuery,
  useGetVendorByIdQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetFriendWishlistQuery,
  useGetOccasionsQuery,
  useGetOccasionsByIdQuery,
  useGoogleMeQuery,
  useAddProductRatingMutation,
  useOnlyForYouQuery,
  useContactUsMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetGiftWrappersQuery,
  useGetCouponsQuery,
  useGetOrdersQuery,
  useGetOrderHistoryQuery,
  useCancelOrderMutation,
  useCheckoutMutation,
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useAddFriendMutation,
  useAcceptFriendMutation,
  useRejectFriendMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
  useGetPeopleYouMayKnowQuery,
  useSearchUsersQuery,
  useGetReceivedGiftCardsQuery,
  useGetReceivedGiftCardByIdQuery,
  useGetSentGiftCardsQuery,
  useCreateGiftCardMutation,
  useRedeemGiftCardMutation,
  useGetAdsQuery,
  useGetAdByIdQuery,
  useSaveFcmTokenMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useCalculateOrderPriceMutation,
} = apiSlice;
