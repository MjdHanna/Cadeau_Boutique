import React from "react";
import Banner from "../../views/Banner/Banner";
import Slider from "../../views/Slider/Slider";
import LatestProducts from "../../views/LatestProducts/LatestProducts";
import Brands from "../../views/Brands/Brands";
import OccasionSlider from "../../views/OccasionSlider/OccasionSlider";
import OnlyForYou from "../../views/OnlyForYou/OnlyForYou";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/features/authSlice";
import GiftCardsHome from "../GiftCards/GiftCardsHome";

const Home = () => {
  const token = useSelector(selectToken);

  return (
    <div>
      <Banner />
      <Slider />
      <OccasionSlider />

      {token && <GiftCardsHome />}

      <OnlyForYou />
      <LatestProducts />
      <Brands />
    </div>
  );
};

export default Home;
