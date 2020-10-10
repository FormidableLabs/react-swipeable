# React Swipeable

React swipe event handler hook

[![build status](https://img.shields.io/travis/FormidableLabs/react-swipeable/master.svg?style=flat-square)](https://travis-ci.org/FormidableLabs/react-swipeable) [![Coverage Status](https://img.shields.io/coveralls/FormidableLabs/react-swipeable/master.svg?style=flat-square)](https://coveralls.io/github/FormidableLabs/react-swipeable?branch=master) [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![gzip size](https://flat.badgen.net/bundlephobia/minzip/react-swipeable)](https://bundlephobia.com/result?p=react-swipeable)

[![Edit react-swipeable image carousel with hook](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lrk6955l79?module=%2Fsrc%2FCarousel.js)

[Github Pages Demo](http://stack.formidable.com/react-swipeable/)

### Api

Use the hook and set your swipe(d) handlers.

```jsx
const handlers = useSwipeable({
  onSwiped: (eventData) => console.log("User Swiped!", evenData),
  ...config,
});
return <div {...handlers}> You can swipe here </div>;
```

Spread `handlers` onto the element you wish to track swipes on.

## Props / Config Options

### Event Handler Props

```js
{
  onSwiped,          // Fired after any swipe
  onSwipedLeft,      // Fired after LEFT swipe
  onSwipedRight,     // Fired after RIGHT swipe
  onSwipedUp,        // Fired after UP swipe
  onSwipedDown,      // Fired after DOWN swipe
  onSwiping,         // Fired during any swipe
  onTap,             // Fired after a tap
}
```

### Event data

All Event Handlers are called with the below event data.

```js
{
  event,          // source event
  initial,        // initial swipe [x,y]
  first,          // true for first event
  deltaX,         // x offset (current.x - initial.x)
  deltaY,         // y offset (current.y - initial.y)
  absX,           // absolute deltaX
  absY,           // absolute deltaY
  velocity,       // √(absX^2 + absY^2) / time - "absolute velocity" (speed)
  vxvy,           // [ deltaX/time, deltaY/time] - velocity per axis
  dir,            // direction of swipe (Left|Right|Up|Down)
}
```

### Configuration Props

```js
{
  delta: 10,                             // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,   // preventDefault on touchmove, *See Details*
  trackTouch: true,                      // track touch input
  trackMouse: false,                     // track mouse input
  rotationAngle: 0,                      // set a rotation angle
}
```

**None of the props/config options are required.**

### Hook details

- Hook use requires **react >= 16.8.0**
- The props contained in `handlers` are currently `ref` and `onMouseDown`
  - Please spread `handlers` as the props contained in it could change as react improves event listening capabilities

### preventDefaultTouchmoveEvent Details

**`preventDefaultTouchmoveEvent`** prevents the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event.

Use this to **stop scrolling** in the browser while a user swipes.

- `e.preventDefault()` is only called when:
  - `preventDefaultTouchmoveEvent: true`
  - `trackTouch: true`
  - the users current swipe has an associated `onSwiping` or `onSwiped` handler/prop

Example:

- If a user is swiping right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if the user was swiping left then `e.preventDefault()` would **not** be called.

Please experiment with the [example](http://stack.formidable.com/react-swipeable/) to test `preventDefaultTouchmoveEvent`.

#### passive listener issue

With v6 we've added the passive event listener option by default, setting to it to `false` only when `preventDefaultTouchmoveEvent` is `true.

**When `preventDefaultTouchmoveEvent` is:**
  - `true`  => `{ passive: false }`
  - `false` => `{ passive: true }`

### Browser Support

With the release of v6 `react-swipeable` only supports browsers that support options object for `addEventListener`, [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility). Which mainly means `react-swipeable` does not support ie11 by default, you need to polyfill options. For example using [event-listener-with-options](https://github.com/Macil/event-listener-with-options).

### Version 6 Updates and migration

v6 now only exports a hook, `useSwipeable`.

If would like something similar to the old `<Swipeable>` component you can recreate it from the hook. There are examples in the [migration doc](./migration.md#swipeable-component-examples).

## FAQs

#### How can I add a swipe listener to the `document`?
Example by @merrywhether
- https://github.com/FormidableLabs/react-swipeable/issues/180#issuecomment-649677983
```js
const { ref } = useSwipeable({
  ...
}) as { ref: RefCallback<Document> };

useEffect(() => {
  ref(document);
});
```

## Development

Initial set up, with **node 10+** & **yarn v1**, run `yarn`.

Make changes/updates to the `src/index.ts` file.

**_Please add/update tests if PR adds/changes functionality._**

#### Verify updates with the examples

Build, run, and test examples locally:
`yarn run start:examples`

After the server starts you can then view the examples page with your changes at `http://localhost:3000`.

You can now make updates/changes to `src/index.ts` and webpack will rebuild, then reload the page so you can test your changes!

## License

MIT
