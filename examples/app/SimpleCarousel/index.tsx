import React from 'react';
import { Item, AppContainer, Code } from './components';
import Carousel from './Carousel';
// CREDITS for Carousel:
// https://medium.com/@incubation.ff/build-your-own-css-carousel-in-react-part-one-86f71f6670ca

function SimpleCarousel() {
  return (
    <AppContainer>
      <h2>
        <a
          target="_blank"
          href="https://github.com/FormidableLabs/react-swipeable"
        >
          react-swipeable
        </a>{" "}
        v6.1.0
      </h2>
      <p>
        Carousel impliments <Code>useSwipeable</Code> hook to track touch/swipe
      </p>
      <Carousel>
        <Item img="https://unsplash.it/475/205" />
        <Item img="https://unsplash.it/476/205" />
        <Item img="https://unsplash.it/477/205" />
        <Item img="https://unsplash.it/478/205" />
        <Item img="https://unsplash.it/479/205" />
      </Carousel>
    </AppContainer>
  );
}

export default SimpleCarousel;
