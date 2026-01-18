import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ onRate, disabled, value }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (disabled) return;
    setSelected(value);
    onRate(value);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={28}
          className={`cursor-pointer transition
            ${
              (hovered || value) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
          `}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => !disabled && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
