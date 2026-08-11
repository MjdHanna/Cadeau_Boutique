import React, { memo } from "react";
import { motion } from "framer-motion";

const BrandCard = ({ brand, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="relative cursor-pointer bg-white rounded-3xl overflow-hidden transition-all duration-300 border-2 border-gray-100 hover:border-gray-300 hover:shadow-lg"
    >
      <div className="h-28 w-full bg-gray-100 relative">
        {brand.brandCoverImg && (
          <img
            src={brand.brandCoverImg}
            alt={`${brand.brandName} Cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
       
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

     
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md">
          <img
            src={brand.brandLogo}
            alt={`${brand.brandName} Logo`}
            className="w-full h-full object-contain rounded-full bg-white"
            loading="lazy"
          />
        </div>
      </div>
      <div className="pt-12 pb-5 px-4 text-center">
        <h3 className="font-black text-lg truncate text-gray-900">
          {brand.brandName}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10 leading-tight">
          {brand.brandDescription}
        </p>
      </div>
    </motion.div>
  );
};

export default memo(BrandCard);
