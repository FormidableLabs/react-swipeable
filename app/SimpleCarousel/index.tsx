import React from 'react';
import { Item } from '../components';
import Carousel from './Carousel';
// Carousel originally copied from:
// https://medium.com/@incubation.ff/build-your-own-css-carousel-in-react-part-one-86f71f6670ca

function SimpleCarousel() {
  return (
    <div>
      <h5 style={{ marginBottom: '20px' }}>
        <strong>🖼 Image Carousel</strong>
      </h5>

      <Carousel>
        <Item img="https://unsplash.it/475/205" />
        <Item img="https://unsplash.it/476/205" />
        <Item img="https://unsplash.it/477/205" />
        <Item img="https://unsplash.it/478/205" />
        <Item img="https://unsplash.it/479/205" />
      </Carousel>
      <b>Note: swipe must be "faster" then 500ms to trigger.</b>
      <h6>
        <a href="https://github.com/FormidableLabs/react-swipeable/blob/main/examples/app/SimpleCarousel/Carousel.tsx">See code</a> for example usage of <code style={{ whiteSpace: "nowrap" }}>swipeDuration</code> and <code>preventScrollOnSwipe</code>.
      </h6>
    </div>
  );
}

export default SimpleCarousel;
