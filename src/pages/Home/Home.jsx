import React from "react";
import Banner from "../../components/Banner/Banner";
import Slider from "../../components/Slider/Slider";
import LatestProducts from "../../components/LatestProducts/LatestProducts";
import Brands from "../../components/Brands/Brands";

const Home = () => {
  return (
    <div>
      <Banner />
      <Slider />
      <LatestProducts />
      <Brands />
    </div>
  );
};

export default Home;
