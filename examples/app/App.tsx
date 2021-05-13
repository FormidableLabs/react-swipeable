import * as React from 'react';
import FeatureTestConsole from './FeatureTestConsole';
import SimpleCarousel from './SimpleCarousel';
import SimplePattern from './SimplePattern';
import { Paper } from './components';

export default function App({version}: {version: any}) {
  return (
    <div className="row">
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
          <dd><a href="#FeatureTestConsole">💻 Feature testing with console log ⇨</a></dd>
          <dd><a href="#SimpleCarousel">🖼 Image Carousel ⇨</a></dd>
          <dd><a href="#SimplePattern">👉 Swipe pattern ⇨</a></dd>
        </dl>
        <hr />

        <Paper id="FeatureTestConsole">
          <FeatureTestConsole />
        </Paper>
        <hr />

        <Paper id="SimpleCarousel">
          <SimpleCarousel />
        </Paper>
        <hr />

        <Paper id="SimplePattern">
          <SimplePattern />
        </Paper>
        <hr />

        <p style={{"marginBottom": "2rem"}}>
          Thanks for checking out the examples! Let us know if you discover anything or have thoughts on improvements, and&nbsp;
          <a href="https://github.com/FormidableLabs/react-swipeable/issues">submit an issue or PR!</a>
        </p>
      </div>
    </div>
  )
}
