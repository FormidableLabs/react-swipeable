import React from 'react';
import FeatureTestConsole from './FeatureTestConsole.js';
import SimpleCarousel from './SimpleCarousel.js';

export default function App() {
  return (
    <div className="row">
      <div className="medium-6 column" style={{width: "95%"}}>
        <h1>react-swipeable&nbsp;<a href="https://github.com/dogfessional/react-swipeable" style={{fontSize: "0.75rem"}}>View on GitHub</a></h1>
        <dl>
          <dt>Examples:</dt>
          <dd><a href="#FeatureTestConsole">Feature testing with console log output ⇨</a></dd>
          <dd><a href="#SimpleCarousel">Simple Image Carousel using react-swipeable ⇨</a></dd>
        </dl>
        <hr />
        <FeatureTestConsole />
        <hr />
        <SimpleCarousel />
        <hr />
        <p style={{"marginBottom": "2rem"}}>
          Thanks for checking out the example app! Let us know if you find any bugs, and&nbsp;
          <a href="https://github.com/dogfessional/react-swipeable/pulls">submit a PR!</a>
        </p>
      </div>
    </div>
  )
}
