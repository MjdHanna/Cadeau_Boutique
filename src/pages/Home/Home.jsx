import React from "react";
import Banner from "../../views/Banner/Banner";
import Slider from "../../views/Slider/Slider";
import LatestProducts from "../../views/LatestProducts/LatestProducts";
import Brands from "../../views/Brands/Brands";
import OccasionSlider from "../../views/OccasionSlider/OccasionSlider";

const Home = () => {
  return (
    <div>
      <Banner />
      <Slider />
      <OccasionSlider />
      <LatestProducts />
      <Brands />
    </div>
  );
};

export default Home;
