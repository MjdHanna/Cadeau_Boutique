import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useGetMyFollowedBrandsQuery } from "../../redux/features/apiSlice";

import FollowedBrandCard from "./FollowedBrandCard";
import FollowedBrandsSkeleton from "./FollowedBrandsSkeleton";

const FollowedBrands = () => {
  const { t } = useTranslation();

  const { data, isLoading, isFetching } = useGetMyFollowedBrandsQuery();

  if (isLoading || isFetching) return <FollowedBrandsSkeleton />;

  if (!data?.data?.length)
    return (
      <div className="text-center py-10 text-gray-500">
        {t("You are not following any brands yet")}
      </div>
    );

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">{t("Followed Brands")}</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {data.data.map((brand) => (
          <FollowedBrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default memo(FollowedBrands);
