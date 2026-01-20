import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetFilteredProductsQuery } from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";

const SearchPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const filters = useMemo(() => {
    const params = new URLSearchParams(search);
    return Object.fromEntries(params.entries());
  }, [search]);

  const hasValidSearch =
    Object.keys(filters).length > 0 &&
    (!filters.name || filters.name.length >= 3);

  const { data, isLoading, error } = useGetFilteredProductsQuery(
    hasValidSearch ? filters : skipToken,
  );

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-20 text-red-500">{error?.data?.message}</p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.data?.map((product) => (
          <ItemCard
            key={product.productId}
            price={product.productPriceFrom}
            product={product}
            onClick={() => navigate(`/products/${product.productId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
