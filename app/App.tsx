import * as React from 'react';
// @ts-ignore
import ScrollUp from 'react-scroll-up';
import FeatureTestConsole from './FeatureTestConsole';

const scrollUpArrowStyles = { fontSize: '20px', border: '2px solid black', borderRadius: '50%', padding: '10px', background: 'white' };

export default function App({version}: {version: any}) {
  return (
    <div className="row">
      <ScrollUp showUnder={20}
                easing={'easeOutCubic'}
                duration={500}>
          <span style={scrollUpArrowStyles}>▲</span>
      </ScrollUp>
      <div className="medium-6 column" style={{width: "95%"}}>
        <h1>react-swipeable&nbsp;<a href="https://github.com/FormidableLabs/react-swipeable" style={{fontSize: "0.75rem"}}>v{version}</a></h1>
        <dl>
          <dt>Examples:</dt>
          <dd><a href="#FeatureTestConsole">Feature testing with console log output ⇨</a></dd>
          <dd><a href="#SimpleCarousel">Image Carousel using react-swipeable ⇨</a></dd>
          <dd><a href="#SimplePattern">Swipe pattern using react-swipeable ⇨</a></dd>
        </dl>
        <hr />
        <FeatureTestConsole />
        <hr />
        <h2>Codesandbox Examples:</h2>
        <div className="row" id="SimpleCarousel">
          <iframe src="https://codesandbox.io/embed/react-swipeable-image-carousel-hben8?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FCarousel.js&theme=light&view=preview" style={{width: '100%', height: '500px', border: '0', borderRadius: '4px', overflow: 'hidden'}} title="react-swipeable image carousel" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />
        </div>
        <hr />
        <div className="row" id="SimplePattern">
          <iframe src="https://codesandbox.io/embed/react-swipeable-direction-pattern-example-jkt4z?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fpattern.js&theme=light&view=preview"
          style={{width: '100%', height: '500px', border: '0', borderRadius: '4px', overflow: 'hidden'}}
          title="react-swipeable direction pattern example"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />
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
