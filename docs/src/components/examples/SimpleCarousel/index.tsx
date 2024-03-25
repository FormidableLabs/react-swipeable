import React from "react";
import { Item } from "../components";
import Carousel from "./Carousel";
import Product1 from "@site/static/img/product-1.jpg";
import Product2 from "@site/static/img/product-2.jpg";
import Product3 from "@site/static/img/product-3.jpg";
import Product4 from "@site/static/img/product-4.jpg";
import Product5 from "@site/static/img/product-5.jpg";

// Carousel originally copied from:
// https://medium.com/@incubation.ff/build-your-own-css-carousel-in-react-part-one-86f71f6670ca

function SimpleCarousel() {
  return (
    <div>
      <Carousel>
        <Item src={Product1} />
        <Item src={Product2} />
        <Item src={Product3} />
        <Item src={Product4} />
        <Item src={Product5} />
      </Carousel>
      <b>Note: swipe must be "faster" than 500ms to trigger.</b>
      <h6>
        <a href="https://github.com/FormidableLabs/react-swipeable/blob/main/examples/app/SimpleCarousel/Carousel.tsx">
          See code
        </a>{" "}
        for example usage of{" "}
        <code style={{ whiteSpace: "nowrap" }}>swipeDuration</code> and{" "}
        <code>preventScrollOnSwipe</code>.
      </h6>
    </div>
  );
}

export default SimpleCarousel;
