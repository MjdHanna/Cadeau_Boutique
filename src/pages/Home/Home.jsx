import React, { useState } from "react";
import Banner from "../../views/Banner/Banner";
import Slider from "../../views/Slider/Slider";
import LatestProducts from "../../views/LatestProducts/LatestProducts";
import Brands from "../../views/Brands/Brands";
import OccasionSlider from "../../views/OccasionSlider/OccasionSlider";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import OnlyForYou from "../../views/OnlyForYou/OnlyForYou";

const Home = () => {
  return (
    <div>
      <Banner />
      <Slider />
      <OccasionSlider />
      <OnlyForYou />
      <LatestProducts />
      <Brands />
    </div>
  );
};

export default Home;
