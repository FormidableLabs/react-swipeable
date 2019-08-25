React Swipeable
=========================

React swipe event handler component & hook

[![build status](https://img.shields.io/travis/dogfessional/react-swipeable/master.svg?style=flat-square)](https://travis-ci.org/dogfessional/react-swipeable) [![Coverage Status](https://img.shields.io/coveralls/dogfessional/react-swipeable/master.svg?style=flat-square)](https://coveralls.io/github/dogfessional/react-swipeable?branch=master) [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![gzip size](https://flat.badgen.net/bundlephobia/minzip/react-swipeable)](https://bundlephobia.com/result?p=react-swipeable)

[![Edit react-swipeable image carousel with hook](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lrk6955l79?module=%2Fsrc%2FCarousel.js)

[Github Pages Demo](https://dogfessional.github.io/react-swipeable/)

### Api
Use React-hooks or a Component and set your swipe(d) handlers.
```js
import { useSwipeable, Swipeable } from 'react-swipeable'
```

#### Hook
```jsx
const handlers = useSwipeable({ onSwiped: (eventData) => eventHandler, ...config })
return (<div {...handlers}> You can swipe here </div>)
```
Spread `handlers` onto the element you wish to track swipes inside of. [Details below](#hook-details).

#### Component
```jsx
<Swipeable onSwiped={(eventData) => eventHandler} {...config} >
  You can swipe here!
</Swipeable>
```

The Component `<Swipeable>` uses a `<div>` by default under the hood to attach event handlers to.

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
  initial,        // initial swipe [x,y]
  first,          // true for first event
  deltaX,         // x offset (initial.x - current.x)
  deltaY,         // y offset (initial.y - current.y)
  absX,           // absolute deltaX
  absY,           // absolute deltaY
  velocity,       // √(absX^2 + absY^2) / time
  dir,            // direction of swipe (Left|Right|Up|Down)
}
```

### Configuration Props

```
{
  delta: 10,                             // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
  trackTouch: true,                      // track touch input
  trackMouse: false,                     // track mouse input
  rotationAngle: 0,                      // set a rotation angle
}
```

### Component Specific Props

```
{
  nodeName: 'div',    // internally rendered component dom node
  innerRef            // callback ref for internal component dom node
}
```

**None of the props/config options are required.**

### Hook details
- Hook use requires **react >= 16.8.0**
- The props contained in `handlers` are currently `ref` and `onMouseDown`
  - Please spread `handlers` as the props contained in it could change as react improves event listening capabilities
    - See [#127](https://github.com/dogfessional/react-swipeable/issues/127) for some more context

### preventDefaultTouchmoveEvent Details

**`preventDefaultTouchmoveEvent`** prevents the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event. Use this to stop the browser from scrolling while a user swipes.
* `e.preventDefault()` is only called when:
  * `preventDefaultTouchmoveEvent: true`
  * `trackTouch: true`
  * the users current swipe has an associated `onSwiping` or `onSwiped` handler/prop

Example:
   * If a user is swiping right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if the user was swiping left then `e.preventDefault()` would **not** be called.

Please experiment with the [example](http://dogfessional.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.


### Version 5 Updates
[React hooks](https://reactjs.org/docs/hooks-reference.html) have been released with [16.8.0](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html) 🎉

v5 of `react-swipeable` includes a hook, `useSwipeable`, that provides the same great functionality as `<Swipeable>`. See the `useSwipeable` hook in action with this [codesandbox](https://codesandbox.io/s/lrk6955l79?module=%2Fsrc%2FCarousel.js).

The component is still included and migration to v5 is straightforward. Please see the [migration doc](./migration.md) for more details including more info on the simplified api.

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
