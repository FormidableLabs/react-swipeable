import React from "react";
import { Item } from "../components";
import Carousel from "./pattern";
import { Product1, Product2, Product3, Product4, Product5 } from "../images";
// Carousel originally copied from:
// https://medium.com/@incubation.ff/build-your-own-css-carousel-in-react-part-one-86f71f6670ca

function SimplePattern() {
  return (
    <div>
      <Carousel>
        <Item src={Product1} />
        <Item src={Product2} />
        <Item src={Product3} />
        <Item src={Product4} />
        <Item src={Product5} />
      </Carousel>
      <h6>
        <a href="https://github.com/FormidableLabs/react-swipeable/blob/main/examples/app/SimplePattern/pattern.tsx">
          See code
        </a>{" "}
        for example usage of <code>onTouchStartOrMouseDown</code> and{" "}
        <code>touchEventOptions</code>
      </h6>
    </div>
  );
}

export default SimplePattern;
