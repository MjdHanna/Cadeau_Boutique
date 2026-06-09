import React, { memo } from "react";

const BrandCard = ({ brand, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow hover:shadow-xl cursor-pointer p-6 text-center"
    >
      <img
        src={brand.brandLogo}
        alt={brand.brandName}
        loading="lazy"
        className="h-32 mx-auto object-contain"
      />
      <h3 className="mt-4 font-bold text-lg">{brand.brandName}</h3>
      <p className="text-gray-500 text-sm mt-2">{brand.brandDescription}</p>
    </div>
  );
};

export default memo(BrandCard);
