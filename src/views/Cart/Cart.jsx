import React from "react";
import EmptyState from "../../components/EmptyState/EmptyState";
import p from "../../assets/images/Cart/Frame.png";

const Cart = () => {
  return (
    <EmptyState imageSrc={p} descriptionKey="Add items to start shopping" />
  );
};
export default Cart;
