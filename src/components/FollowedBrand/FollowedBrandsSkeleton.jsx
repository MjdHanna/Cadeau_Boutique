const FollowedBrandsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border p-5 flex gap-4"
        >
          <div className="w-20 h-20 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowedBrandsSkeleton;
