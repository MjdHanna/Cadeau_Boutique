import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetFilteredProductsQuery,
  useGetWishlistQuery,
} from "../../redux/features/apiSlice";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import ItemCard from "../../components/brands/ItemCard";
import Loaderer from "../Loader/Loader";
import { useTranslation } from "react-i18next";
const SearchPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const filters = useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);
  const { t, i18n } = useTranslation();
  const hasValidSearch =
    Object.keys(filters).length > 0 &&
    (!filters.name || filters.name.length >= 3);

  const { data, isLoading, error } = useGetFilteredProductsQuery(
    hasValidSearch ? filters : skipToken,
  );
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const wishlistItems = wishlistData?.data?.wishlistItems || [];
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loaderer />
      </div>
    );
  }
  if (error)
    return (
      <p className="text-center py-20 text-red-500">{error?.data?.message}</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.data?.map((product) => (
          <ItemCard
            key={product.productId}
            price={product.productPriceFrom}
            product={product}
            onClick={() => navigate(`/products/${product.productId}`)}
            wishlistItems={wishlistItems}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
