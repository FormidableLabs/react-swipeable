React Swipeable
=========================

React swipe component - Swipe bindings for react

[![build status](https://img.shields.io/travis/dogfessional/react-swipeable/master.svg?style=flat-square)](https://travis-ci.org/dogfessional/react-swipeable) [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable)

[![Edit qq7759m3lq](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/qq7759m3lq?module=%2Fsrc%2FCarousel.js)

[Github Pages Demo](https://dogfessional.github.io/react-swipeable/)

### Installation
```
$ npm install --save react-swipeable
```

### Use
```js
import Swipeable from 'react-swipeable'

class SwipeComponent extends React.Component {

  swiping(e, deltaX, deltaY, absX, absY, velocity) {
    console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
  }

  swipingLeft(e, absX) {
    console.log("You're Swiping to the Left...", e, absX)
  }

  swiped(e, deltaX, deltaY, isFlick, velocity) {
    console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
  }

  swipedUp(e, deltaY, isFlick) {
    console.log("You Swiped Up...", e, deltaY, isFlick)
  }

  render() {
    return (
      <Swipeable
        onSwiping={this.swiping}
        onSwipingLeft={this.swipingLeft}
        onSwiped={this.swiped}
        onSwipedUp={this.swipedUp} >
          You can swipe here!
      </Swipeable>
    )
  }
}
```
react-swipeable(`<Swipeable>`) generates a new React element(`<div>` by default) under the hood and binds touch events to it that are used to fire the `swiping` and `swiped` props.

## Props / Config Options

### Event Props

**`onSwiping`**, **`onSwipingUp`**, **`onSwipingRight`**, **`onSwipingDown`**, **`onSwipingLeft`**, are called with the event
as well as the absolute delta of where the swipe started and where it's currently at. These constantly fire throughout touch events.

**`onSwiping`** in addition to the swipe delta, `onSwiping` also returns the current absolute X and Y position, as well as the current velocity of the swipe. `this.props.onSwiping(e, deltaX, deltaY, absX, absY, velocity)`

**`onSwipedUp`**, **`onSwipedRight`**, **`onSwipedDown`**, **`onSwipedLeft`** are called with the event
as well as the x distance, + or -, from where the swipe started to where it ended. These only fire at the end of a touch event.

**`onSwiped`** is called with the event, the X and Y delta, whether or not the event was a flick, and the current velocity of the swipe. `this.props.onSwiped(e, deltaX, deltaY, isFlick, velocity)`

**`onTap`** is triggered when a tap happens, specifically when a swipe/touch moves less than the `delta`. Is called with the onTouchEnd event `this.props.onTap(e)`

### Configuration Props

**`flickThreshold`** is a number (float) which determines the max velocity of a swipe before it's considered a flick. The default value is `0.6`.

**`delta`** is the amount of px before we start firing events. Also affects how far `onSwipedUp`, `onSwipedRight`, `onSwipedDown`, and `onSwipedLeft` need to be before they fire events. The default value is `10`.

**`preventDefaultTouchmoveEvent`** is whether to prevent the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event.  Sometimes you would like the target to scroll natively.  The default value is `false`.
 * **Notes** `e.preventDefault()` is only called when `preventDefaultTouchmoveEvent` is `true` **and** the user is swiping in a direction that has an associated directional `onSwiping` or `onSwiped` prop.
   * Example: user is swiping right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if user was swiping left `e.preventDefault()` would **not** be called.
   * Please experiment with [example](http://dogfessional.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.
   * `swipeable` versions < `4.2.0` - [Chrome 56 and later, warning with preventDefault](#chrome-56-and-later-warning-with-preventdefault)

**`stopPropagation`** automatically calls stopPropagation on all 'swipe' events. The default value is `false`.

**`nodeName`** is a string which determines the html element/node that this react component binds its touch events to then returns. The default value is `'div'`.

**`trackMouse`** will allow mouse 'swipes' to ***additonally*** be tracked(click, hold, move, let go). See [#51](https://github.com/dogfessional/react-swipeable/issues/51) for more details. The default value is `false`.

**`disabled`** will disable `<Swipeable>`: swipes will not be tracked and this stops current active swipes from triggering anymore prop callbacks. The default value is `false`.

**`innerRef`** will allow access to the Swipeable's inner dom node element react ref. See [#81](https://github.com/dogfessional/react-swipeable/issues/81) for more details. Example usage `<Swipeable innerRef={(el) => this.swipeableEl = el} >`. Then you'll have access to the dom element that Swipeable uses internally.

**`rotationAngle`** will allow to set a rotation angle, e.g. for a four-player game on a tablet, where each player has a 90° turned view. The default value is `0`.

**None of the props are required.**
### PropType Definitions

#### Event Props:
```
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onSwipingUp: PropTypes.func,
  onSwipingRight: PropTypes.func,
  onSwipingDown: PropTypes.func,
  onSwipingLeft: PropTypes.func,
  onSwipedUp: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedDown: PropTypes.func,
  onSwipedLeft: PropTypes.func,
  onTap: PropTypes.func,
```
#### Config Props:
```
  flickThreshold: PropTypes.number, // default: 0.6
  delta: PropTypes.number, // default: 10
  preventDefaultTouchmoveEvent: PropTypes.bool, // default: false
  stopPropagation: PropTypes.bool, // default: false
  nodeName: PropTypes.string // default: div
  trackMouse: PropTypes.bool, // default: false
  disabled: PropTypes.bool, // default: false
  innerRef: PropTypes.func,
  rotationAngle: PropTypes.number // default: 0
```

## Development

Initial set up, with `node 8+`, run `npm install`.

Make changes/updates to the `src/Swipeable.js` file.

Before creating a PR please run `npm test` to make sure the tests and lint pass.
- Please add tests if PR adds/changes functionality.

#### Test changes/updates with the examples

Build, run, and test examples locally:
`npm run start:examples`

After the server starts you can then view the examples page with your changes at `http://localhost:3000`.

You can now make updates/changes to `src/Swipeable.js` and webpack will rebuild, then reload the page so you can test your changes!

## Notes
### Chrome 56 and later, warning with preventDefault
`swipeable` version `>=4.2.0` should fix this issue. [PR here](https://github.com/dogfessional/react-swipeable/pull/88).

The issue still exists in versions `<4.2.0`:
- When this library tries to call `e.preventDefault()` in Chrome 56+ a warning is logged:
- `Unable to preventDefault inside passive event listener due to target being treated as passive.`

This warning is because this [change](https://developers.google.com/web/updates/2017/01/scrolling-intervention) to Chrome 56+ and the way the synthetic events are setup in reactjs.

Follow reacts handling of this issue here: [facebook/react#8968](https://github.com/facebook/react/issues/8968)

## License

MIT
