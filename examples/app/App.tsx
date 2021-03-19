import * as React from 'react';
// @ts-ignore
import ScrollUp from 'react-scroll-up';
import FeatureTestConsole from './FeatureTestConsole';
import SimpleCarousel from './SimpleCarousel';
import SimplePattern from './SimplePattern';

const scrollUpArrowStyles = { fontSize: '20px', border: '2px solid black', borderRadius: '50%', padding: '10px', background: 'white' };

export default function App({version}: {version: any}) {
  return (
    <div className="row">
      <ScrollUp
        showUnder={20}
        easing={'easeOutCubic'}
        duration={500}
      >
        <span style={scrollUpArrowStyles}>▲</span>
      </ScrollUp>

      <div className="medium-6 column" style={{width: "95%"}}>
        <h1>
          react-swipeable&nbsp;
          <a
            href="https://github.com/FormidableLabs/react-swipeable"
            style={{fontSize: "0.75rem"}}
          >
            v{version}
          </a>
        </h1>

        <dl>
          <dt>Examples:</dt>
          <dd><a href="#FeatureTestConsole">Feature testing with console log output ⇨</a></dd>
          <dd><a href="#SimpleCarousel">Image Carousel using react-swipeable ⇨</a></dd>
          <dd><a href="#SimplePattern">Swipe pattern using react-swipeable ⇨</a></dd>
        </dl>
        <hr />

        <div id="FeatureTestConsole">
          <FeatureTestConsole />
        </div>
        <hr />

        <div id="SimpleCarousel" style={{ marginBottom: '84px' }}>
          <SimpleCarousel />
        </div>
        <hr />

        <div id="SimplePattern">
          <SimplePattern />
        </div>
        <hr />

        <p style={{"marginBottom": "2rem"}}>
          Thanks for checking out the examples! Let us know if you discover anything or have thoughts on improvements, and&nbsp;
          <a href="https://github.com/FormidableLabs/react-swipeable/issues">submit an issue or PR!</a>
        </p>
      </div>
    </div>
  )
}
