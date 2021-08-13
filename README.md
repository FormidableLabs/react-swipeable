# React Swipeable

React swipe event handler hook

[![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg)](https://www.npmjs.com/package/react-swipeable) [![npm version](https://img.shields.io/npm/v/react-swipeable.svg)](https://www.npmjs.com/package/react-swipeable) [![build status](https://github.com/FormidableLabs/react-swipeable/actions/workflows/ci.yml/badge.svg)](https://github.com/FormidableLabs/react-swipeable/actions) [![gzip size](https://badgen.net/bundlephobia/minzip/react-swipeable)](https://bundlephobia.com/result?p=react-swipeable) [![maintenance status](https://img.shields.io/badge/maintenance-active-green.svg)](https://github.com/FormidableLabs/react-swipeable#maintenance-status)

[![Edit react-swipeable image carousel](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/FormidableLabs/react-swipeable/tree/main/examples?file=/app/SimpleCarousel/Carousel.tsx)

### [Github Pages Demo](http://formidablelabs.github.io/react-swipeable/)

### Api

Use the hook and set your swipe(d) handlers.

```jsx
const handlers = useSwipeable({
  onSwiped: (eventData) => console.log("User Swiped!", eventData),
  ...config,
});
return <div {...handlers}> You can swipe here </div>;
```

Spread `handlers` onto the element you wish to track swipes on.

## Props / Config Options

### Event handler props

```js
{
  onSwiped,       // After any swipe   (SwipeEventData) => void
  onSwipedLeft,   // After LEFT swipe  (SwipeEventData) => void
  onSwipedRight,  // After RIGHT swipe (SwipeEventData) => void
  onSwipedUp,     // After UP swipe    (SwipeEventData) => void
  onSwipedDown,   // After DOWN swipe  (SwipeEventData) => void
  onSwipeStart,   // Start of swipe    (SwipeEventData) => void *see details*
  onSwiping,      // During swiping    (SwipeEventData) => void
  onTap,          // After a tap       ({ event }) => void
}
```

#### Details
- `onSwipeStart` - called only once per swipe at the start and before the first `onSwiping` callback
  - The `first` property of the `SwipeEventData` will be `true`

### Configuration props and default values

```js
{
  delta: 10,                            // min distance(px) before a swipe starts. *See Notes*
  preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
  trackTouch: true,                     // track touch input
  trackMouse: false,                    // track mouse input
  rotationAngle: 0,                     // set a rotation angle
}
```

#### Delta

`delta` can be either a `number` or an `object` specifying different deltas for each direction, [`left`, `right`, `up`, `down`], direction values are optional and will default to `10`;

```js
{
  delta: { top: 20, bottom: 20 } // top and bottom when ">= 20", left and right default to ">= 10"
}
```

## Swipe Event Data

All Event Handlers are called with the below event data, `SwipeEventData`.

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

**None of the props/config options are required.**

### Hook details

- Hook use requires **react >= 16.8.3**
- The props contained in `handlers` are currently `ref` and `onMouseDown`
  - Please spread `handlers` as the props contained in it could change as react improves event listening capabilities

### `preventDefaultTouchmoveEvent` details

This prop allows you to prevent the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event default action, mostly "scrolling".

Use this to **stop scrolling** in the browser while a user swipes.
- You can additionally try `touch-action` css property, [see below](#how-to-use-touch-action-to-prevent-scrolling)

`e.preventDefault()` is only called when:
  - `preventDefaultTouchmoveEvent: true`
  - `trackTouch: true`
  - the users current swipe has an associated `onSwiping` or `onSwiped` handler/prop

Example scenario:
> If a user is swiping right with props `{ onSwipedRight: userSwipedRight, preventDefaultTouchmoveEvent: true }` then `e.preventDefault()` will be called, but if the user was swiping left then `e.preventDefault()` would **not** be called.

Please experiment with the [example app](http://formidablelabs.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.

#### passive listener
With v6 we've added the passive event listener option, by default, to **internal uses** of `addEventListener`. We set the `passive` option to `false` only when `preventDefaultTouchmoveEvent` is `true`.

**When `preventDefaultTouchmoveEvent` is:**
  - `true`  => `el.addEventListener(event, cb, { passive: false })`
  - `false` => `el.addEventListener(event, cb, { passive: true })`

React's long running passive [event issue](https://github.com/facebook/react/issues/6436).

We previously had issues with chrome lighthouse performance deducting points for not having passive option set.

### Browser Support

The release of v6 `react-swipeable` we only support browsers that support options object for `addEventListener`, [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility). Which mainly means `react-swipeable` does not support ie11 by default, you need to polyfill options. For example using [event-listener-with-options](https://github.com/Macil/event-listener-with-options).

### Version 6 Updates and migration

If upgrading from v5 or later please refer to the release notes and the [v6 migration doc](./migration.md)

v6 now only exports a hook, `useSwipeable`.

If you would like something similar to the old `<Swipeable>` component you can recreate it from the hook. There are examples in the [migration doc](./migration.md#swipeable-component-examples).

## FAQs

### How can I add a swipe listener to the `document`?
Example by [@merrywhether #180](https://github.com/FormidableLabs/react-swipeable/issues/180#issuecomment-649677983)
```js
const { ref } = useSwipeable({
  ...
}) as { ref: RefCallback<Document> };

useEffect(() => {
  ref(document);
});
```

### How to share `ref` from `useSwipeable`?

**Example ref passthrough, [more details #189](https://github.com/FormidableLabs/react-swipeable/issues/189#issuecomment-656302682):**
```js
const MyComponent = () => {
  const handlers = useSwipeable({ onSwiped: () => console.log('swiped') })

  // setup ref for your usage
  const myRef = React.useRef();

  const refPassthrough = (el) => {
    // call useSwipeable ref prop with el
    handlers.ref(el);

    // set myRef el so you can access it yourself
    myRef.current = el;
  }

  return (<div {...handlers} ref={refPassthrough} />
}
```

### How to use `touch-action` to prevent scrolling?

Sometimes you don't want the `body` of your page to scroll along with the user manipulating or swiping an item.

You might try to prevent the event default action via [preventDefaultTouchmoveEvent](#preventdefaulttouchmoveevent-details), which calls `event.preventDefault()`. **But** there may be a simpler, more effective solution, which has to do with a simple CSS property.

`touch-action` is a CSS property that sets how an element's region can be manipulated by a touchscreen user.

```js
const handlers = useSwipeable({
  onSwiped: (eventData) => console.log("User Swiped!", evenData),
  ...config,
});
return <div {...handlers} style={{ touchAction: 'pan-y' }}> Swipe here </div>;
```
This explanation and example borrowed from `use-gesture`'s [wonderful docs](https://use-gesture.netlify.app/docs/extras/#touch-action).

## License

[MIT]((./LICENSE))

## Contributing

Please see our [contributions guide](./CONTRIBUTING.md).

### Maintainers
[Project Maintenance](./CONTRIBUTING.md#project-maintainers)

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.
