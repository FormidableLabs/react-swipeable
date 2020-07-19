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
          <dd><a href="#SimpleCarousel">Simple Image Carousel using react-swipeable ⇨</a></dd>
        </dl>
        <hr />
        <FeatureTestConsole />
        <hr />
        <div className="row" id="SimpleCarousel">
          <iframe src="https://codesandbox.io/embed/lrk6955l79" style={{width:'100%', height:'500px', border:'0', borderRadius:'4px', overflow:'hidden'}} sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" />
        </div>
        <hr />
        <p style={{"marginBottom": "2rem"}}>
          Thanks for checking out the example app! Let us know if you find any bugs, and&nbsp;
          <a href="https://github.com/FormidableLabs/react-swipeable/pulls">submit a PR!</a>
        </p>
      </div>
    </div>
  )
}
