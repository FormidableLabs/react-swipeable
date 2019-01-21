import React, {Component} from 'react';
import { Swipeable } from '../../src/index.js';

const IMG_1 = `https://unsplash.it/342/249`;
const IMG_2 = `https://unsplash.it/342/250`;
const IMG_3 = `https://unsplash.it/342/251`;
const IMG_4 = `https://unsplash.it/342/252`;
const IMG_5 = `https://unsplash.it/342/253`;
const IMAGES = [IMG_1, IMG_2, IMG_3, IMG_4, IMG_5];
const IMG_WIDTH = "342px";
const IMG_HEIGHT = "249px";

const RIGHT = '-1';
const LEFT = '+1';

const buttonStyles = {
  height: IMG_HEIGHT,
  color: "#eeeeee",
  fontSize: "2em",
};

export default class SimpleCarousel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { imageIdx: 0 };
  }

  onSwiped(direction) {
    const change = direction === RIGHT ? RIGHT : LEFT;
    const adjustedIdx = this.state.imageIdx + Number(change);
    let newIdx;
    if (adjustedIdx >= IMAGES.length) {
      newIdx = 0;
    } else if (adjustedIdx < 0) {
      newIdx = IMAGES.length - 1
    } else {
      newIdx = adjustedIdx;
    }
    this.setState({ imageIdx: newIdx });
  }

  render() {
    const { imageIdx = 0 } = this.state;
    const imageStyles = {
      width: IMG_WIDTH,
      height: IMG_HEIGHT,
      backgroundImage: `url(${IMAGES[imageIdx]})`
    };
    return (
      <div className="row" id="SimpleCarousel">
        <div className="small-12 column">
          <h5><strong>Simple Image Carousel using react-swipeable.</strong></h5>
          <p>Edit/Play with this example on <a href="https://codepen.io/hartzis/pen/oebBPp" target="_blank">codepen here ⇨</a>.</p>
          <div className="swipeContainer" style={{ textAlign: "center" }}>
            <div>Image: {imageIdx + 1}</div>
            <Swipeable
              className="callout secondary"
              style={{ display: "inline-block", touchAction: 'none', padding: ".5rem" }}
              trackMouse
              preventDefaultTouchmoveEvent
              onSwipedLeft={()=>this.onSwiped(LEFT)}
              onSwipedRight={()=>this.onSwiped(RIGHT)}
            >
              <div style={imageStyles} >
                <button
                  onClick={()=>this.onSwiped(RIGHT)}
                  className="hollow float-left"
                  style={buttonStyles}>⇦</button>
                <button
                  onClick={()=>this.onSwiped(LEFT)}
                  className="hollow float-right"
                  style={buttonStyles}>⇨</button>
              </div>
            </Swipeable>
          </div>
        </div>
      </div>
    )
  }
}

function preload(...images) {
  return images.reduce((acc, img)=>{
    let newImage = new Image();
    newImage.src = img;
    acc.push(newImage);
    return acc;
  }, []);
}
preload.apply(null, IMAGES);
