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
      ];
      if (token && protectedEndpoints.includes(endpoint)) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "Wishlist", "Cart", "Orders", "Friends", "Brands"],
  endpoints: (builder) => ({
    // Auth
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
    // Filteeeer
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
      query: ({ productId, rating, review }) => ({
        url: "rating",
        method: "POST",
        body: {
          productId: Number(productId),
          rating: Number(rating),
          review: review || null,
        },
      }),
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
    }),

    // Orders
    getOrders: builder.query({
      query: () => ({
        url: "orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    checkout: builder.mutation({
      query: (data) => ({
        url: "checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart", "Orders"],
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useResendOtpMutation,
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
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
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
  useGetFilteredProductsQuery,
  useGetOrdersQuery,
  useCheckoutMutation,
  useGetVendorByIdQuery,
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useAddFriendMutation,
  useAcceptFriendMutation,
  useRejectFriendMutation,
  useCancelFriendRequestMutation,
  useRemoveFriendMutation,
  useSearchUsersQuery,
} = apiSlice;
