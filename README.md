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
const hanlders = useSwipeable({ onSwiped: (eventData) => eventHandler, ...config })
return (<div {...handlers}> You can swipe here </div>)


// Component
<Swipeable onSwiped={(eventData) => eventHandler} {...config} >
  You can swipe here!
</Swipeable>
```

The Component `<Swipeable>` uses an element (`<div>` by default) under the hood and attaches event hanlders to it that are used to fire the `swipe(d)` handlers.

## Props / Config Options

### Event Handler Props

```
{
  onSwiped,          // Fired after any swipe
  onSwipedLeft,      // Fired after LEFT swipe
  onSwipedRight,     // Fired after RIGHT swipe
  onSwipedUp,        // Fired after UP swipe
  onSwipedDown,      // Fired after DOWN swipe
  onSwiping,         // Fired during any swipe
}
```

### Event data
All Event Handlers are called with the below event data.
```
{
  event,          // source event
  deltaX,         // x offset (current.x - initial.x)
  deltaY,         // y offset (current.y - initial.y)
  absX,           // absolute deltaX
  absY,           // absolute deltaY
  velocity,       // √(absX^2 + absY^2) / time
  dir,            // direction of swipe (Left|Right|Up|Down)
}
```

### Configuration Props

```
{
  delta: 10,                               // minimum distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,     // preventDefault on touchmove, *See Details*
  trackTouch: true,                        // track touch input
  trackMouse: false,                       // track mouse input
  rotationAngle: 0,                        // set a rotation angle

  touchHandlerOption: {         // overwrite touch handler 3rd argument
    passive: true|false         // defaults opposite of preventDefaultTouchmoveEvent *See Details*
  },
}
```

### Component Specific Props

```
{
  nodeName: 'div',      // dom node the component attaches handlers to
  innerRef              // access the components dom node
}
```

**None of the props are required.**

### preventDefaultTouchmoveEvent Details

**`preventDefaultTouchmoveEvent`** prevents the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event. Can use this to stop the browser from scrolling while a user swipe is being tracked.
* `e.preventDefault()` is only called when:
  * `preventDefaultTouchmoveEvent: true`
  * `trackTouch: true`
  * user swipes in a direction that has an associated `onSwiping` or `onSwiped` handler/prop
* if `preventDefaultTouchmoveEvent: true` then `touchHandlerOption` defaults to `{passive: false}`
* if `preventDefaultTouchmoveEvent: false` then `touchHandlerOption` defaults to `{passive: true}`

Example:
   * A user is swipes right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if user was swipes left then `e.preventDefault()` would **not** be called.

Please experiment with the [example](http://dogfessional.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.


## Development

Initial set up, with `node 10+`, run `npm install`.

Make changes/updates to the `src/index.js` file.

***Please add tests if PR adds/changes functionality.***

#### Verify updates with the examples

Build, run, and test examples locally:
`npm run start:examples`

After the server starts you can then view the examples page with your changes at `http://localhost:3000`.

You can now make updates/changes to `src/index.js` and webpack will rebuild, then reload the page so you can test your changes!

## License

MIT
