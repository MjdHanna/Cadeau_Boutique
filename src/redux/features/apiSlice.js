import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cadeau-boutique-production.up.railway.app/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "Wishlist"],
  endpoints: (builder) => ({
    // Auth Logic
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

    getProfile: builder.query({
      query: () => "profile",
      providesTags: ["Auth"],
      keepUnusedDataFor: 300,
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "send-reset-code",
        method: "POST",
        body: { email },
      }),
    }),

    verifyCode: builder.mutation({
      query: ({ userId, otp }) => ({
        url: "email-verification",
        method: "POST",
        body: { userId, otp },
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "DELETE",
      }),
    }),
    // End Auth Logic

    // Brands
    getBrands: builder.query({
      query: () => "/brands",
    }),
    getBrandById: builder.query({
      query: (brandId) => `/brands/${brandId}`,
    }),
    getCategories: builder.query({
      query: () => "/categories",
    }),
    getCategoryById: builder.query({
      query: (catId) => `/categories/${catId}`,
    }),
    // End Brands

    // WISHLIST ENDPOINTS
    getWishlist: builder.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: "/wishlist/add",
        method: "POST",
        body: { productId: Number(productId) },
      }),
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/remove?productId=${Number(productId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // END WISHLIST ENDPOINTS
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = apiSlice;
