import banner2 from "../../assets/images/Banner/p1.png";
import banner3 from "../../assets/images/Banner/p2.png";
import banner1 from "../../assets/images/Banner/p3.png";

import { useTranslation } from "react-i18next";
import ShowData from "../../components/ShowData/ShowData";

const products = [
  { id: "mock-1", name: "باقة ورد فاخرة", price: "$40", img: banner2 },
  { id: "mock-2", name: "علبة شوكولا فاخرة", price: "$32", img: banner3 },
  { id: "mock-3", name: "هدايا فاخرة", price: "$55", img: banner1 },
];

const LatestProducts = () => {
  const { t } = useTranslation();

  return (
    <ShowData
      title={t("Latest")}
      items={products}
      renderItem={(product) => (
        <>
          <div className="relative">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-52 object-cover rounded-md"
            />
          </div>

          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <span className="font-bold text-primary text-xl">
              {product.price}
            </span>
          </div>
        </>
      )}
    />
  );
};

export default LatestProducts;
