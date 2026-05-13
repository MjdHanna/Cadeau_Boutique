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
        "getOrders",
        "checkout",
      ];

      if (token && protectedEndpoints.includes(endpoint)) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth", "Wishlist", "Cart", "Orders"],
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

        formData.append("userName", data.name);
        formData.append("email", data.email);
        formData.append("gender", data.gender);
        formData.append("birthDate", data.birthDate || "");
        formData.append("phoneNumber", data.phone_number);

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
        } catch (e) {}
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
      query: ({ productId, variantId, quantity }) => ({
        url: "cart/add",
        method: "POST",
        body: {
          productId: Number(productId),
          variantId: Number(variantId),
          quantity: Number(quantity),
        },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: "cart/remove",
        method: "DELETE",
        body: {
          productId: Number(productId),
          variantId: Number(variantId),
        },
      }),
      invalidatesTags: ["Cart"],
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
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useAccountDeleteMutation,
  useGetUserQuery,
  useEditProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useResendOtpMutation,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
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
  useContactUsMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetFilteredProductsQuery,
  useGetOrdersQuery,
  useCheckoutMutation,
  useGetVendorByIdQuery,
} = apiSlice;
