const GiftCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-3xl border p-6">
      <div className="h-8 w-8 bg-gray-200 rounded-full" />

      <div className="h-5 bg-gray-200 rounded mt-4" />

      <div className="h-4 bg-gray-200 rounded mt-3 w-2/3" />

      <div className="h-10 bg-gray-200 rounded mt-6" />
    </div>
  );
};

export default GiftCardSkeleton;
