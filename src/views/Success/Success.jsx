import React from "react";
import EmptyState from "../../components/EmptyState/EmptyState";
import p from "../../assets/images/Success/Group 2209.png";
const Success = () => {
  return <EmptyState imageSrc={p} 
  titleKey="Your Cart Is Empty" />;
};

export default Success;
