import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import {
  useGetBrandByIdQuery,
  useGetWishlistQuery,
} from "../../redux/features/apiSlice";
import ItemCard from "../../components/brands/ItemCard";

const BrandDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const token = useSelector(selectToken);

  const { data, isLoading, error } = useGetBrandByIdQuery(id);

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !token,
  });

  const wishlistItems = wishlistData?.data?.wishlistItems || [];

  const brand = data?.data?.brand;
  const products = useMemo(() => data?.data?.products || [], [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="loader border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        {t("Failed to load brand data")}
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-30">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold">{brand?.brandName}</h2>
        <p className="text-gray-600 mt-2 text-lg">{brand?.brandDescription}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center">{t("No products found")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ItemCard
              key={product.productId}
              image={product.productImage}
              title={product.productName}
              description={product.productDescription}
              price={product.productPrice}
              product={{ id: product.productId }}
              wishlistItems={wishlistItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
