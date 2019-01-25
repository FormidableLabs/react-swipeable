React Swipeable
=========================

React swipe and touch event handler component & hook

[![build status](https://img.shields.io/travis/dogfessional/react-swipeable/master.svg?style=flat-square)](https://travis-ci.org/dogfessional/react-swipeable) [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![gzip size](https://flat.badgen.net/bundlephobia/minzip/react-swipeable)](https://bundlephobia.com/result?p=react-swipeable)

[![Edit qq7759m3lq](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/qq7759m3lq?module=%2Fsrc%2FCarousel.js)

[Github Pages Demo](https://dogfessional.github.io/react-swipeable/)

### Installation
```
$ npm install --save react-swipeable
```

### Api
```js
import { useSwipeable, Swipeable } from 'react-swipeable'
```
Use React-hooks or a Component and set your swipe(d) handlers.
```
// hook with event handler
const hanlders = useSwipeable({
  onSwiped: (data) => console.log('Swiped', data)
})
return (<div {...handlers}> You can swipe here </div>)

// Component
<Swipeable onSwiped={this.swiped} >
  You can swipe here!
</Swipeable>
```

The Component `<Swipeable>`) generates an element(`<div>` by default) under the hood and attaches event hanlders to it that are used to fire the `swiped` props.

## Props / Config Options

### Event Props

**`onSwipedUp`**, **`onSwipedRight`**, **`onSwipedDown`**, **`onSwipedLeft`** - Fired at the end of a swipe for the direction specified.

**`onSwiped`** - Fired at the end of a swipe no matter the direction.

**`onSwiping`** - Constantly fired throughout during a swipe.

### Configuration Props

**`delta`** is the amount of px before we start tracking a swipe. The default value is `10`.

**`preventDefaultTouchmoveEvent`** is whether to prevent the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event.  Sometimes you would like the target to scroll natively.  The default value is `false`.
 * **Notes** `e.preventDefault()` is only called when `preventDefaultTouchmoveEvent` is `true` **and** the user is swiping in a direction that has an associated directional `onSwiping` or `onSwiped` prop.
   * Example: user is swiping right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if user was swiping left `e.preventDefault()` would **not** be called.
   * Please experiment with [example](http://dogfessional.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.
   * `swipeable` versions < `4.2.0` - [Chrome 56 and later, warning with preventDefault](#chrome-56-and-later-warning-with-preventdefault)

**`stopPropagation`** automatically calls stopPropagation on all 'swipe' events. The default value is `false`.

**`nodeName`** is a string which determines the html element/node that the component binds its touch events to then returns. The default value is `'div'`.

**`trackMouse`** will allow mouse 'swipes' to be tracked(click, hold, move, let go). The default value is `false`.

**`rotationAngle`** will allow to set a rotation angle, e.g. for a four-player game on a tablet, where each player has a 90° turned view. The default value is `0`.

**`innerRef`** will allow access to the components inner dom node element. Example usage `<Swipeable innerRef={(el) => this.swipeableEl = el} >`.

**None of the props are required.**
### PropType Definitions

#### Event Props:
```
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onSwipedUp: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedDown: PropTypes.func,
  onSwipedLeft: PropTypes.func,
  onTap: PropTypes.func,
```
#### Config Props:
```
  delta: PropTypes.number, // default: 10
  preventDefaultTouchmoveEvent: PropTypes.bool, // default: false
  stopPropagation: PropTypes.bool, // default: false
  nodeName: PropTypes.string // default: div
  trackMouse: PropTypes.bool, // default: false
  rotationAngle: PropTypes.number // default: 0
  innerRef: PropTypes.func,
  eventListenerOptions
```

## Development

Initial set up, with `node 10+`, run `npm install`.

Make changes/updates to the `src/index.js` file.

***Please add tests if PR adds/changes functionality.***

#### Test changes/updates with the examples

Build, run, and test examples locally:
`npm run start:examples`

After the server starts you can then view the examples page with your changes at `http://localhost:3000`.

You can now make updates/changes to `src/index.js` and webpack will rebuild, then reload the page so you can test your changes!

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
