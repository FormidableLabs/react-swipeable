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

  // Pass through callbacks, event provided: ({ event }) => void
  onTouchStartOrOnMouseDown, // Called for `touchstart` and `mousedown`
  onTouchEndOrOnMouseUp,     // Called for `touchend` and `mouseup`
}
```

#### Details
- `onSwipeStart` - called only once per swipe at the start and before the first `onSwiping` callback
  - The `first` property of the `SwipeEventData` will be `true`

### Configuration props and default values

```js
{
  delta: 10,                             // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: false,           // prevents scroll during swipe (*See Details*)
  trackTouch: true,                      // track touch input
  trackMouse: false,                     // track mouse input
  rotationAngle: 0,                      // set a rotation angle
  swipeDuration: Infinity,               // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true },  // options for touch listeners (*See Details*)
}
```

#### delta

`delta` can be either a `number` or an `object` specifying different deltas for each direction, [`left`, `right`, `up`, `down`], direction values are optional and will default to `10`;

```js
{
  delta: { up: 20, down: 20 } // up and down ">= 20", left and right default to ">= 10"
}
```

#### swipeDuration
A swipe lasting more than `swipeDuration`, in milliseconds, will **not** be considered a swipe.
- It will also **not** trigger any callbacks and the swipe event will stop being tracked
- **Defaults** to `Infinity` for backwards compatibility, a sensible duration could be something like `250`
  - Feature mimicked from `use-gesture` [swipe.duration](https://use-gesture.netlify.app/docs/options/#swipeduration)

```js
{
  swipeDuration: 250 // only swipes under 250ms will trigger callbacks
}
```

#### touchEventOptions

Allows the user to set the options for the touch event listeners( currently only `passive` option ).
  - `touchstart`, `touchmove`, and `touchend` event listeners
  - **Defaults** to `{ passive: true }`
  - this provides users full control of if/when they want to set [passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)
    - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options
  - `preventScrollOnSwipe` option **supersedes** `touchEventOptions.passive` for `touchmove` event listener
    - See `preventScrollOnSwipe` for [more details](#preventscrollonswipe-details)

## Swipe Event Data

All Event Handlers are called with the below event data, `SwipeEventData`.

```js
{
  event,          // source event
  initial,        // initial swipe [x,y]
  first,          // true for the first event of a tracked swipe
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
  - Please spread `handlers` as the props contained in it could change as react changes event listening capabilities

### `preventScrollOnSwipe` details

This prop prevents scroll during swipe in most cases. Use this to **stop scrolling** in the browser while a user swipes.

Swipeable will call `e.preventDefault()` internally in an attempt to stop the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event default action (mostly scrolling).

**NOTE:** `preventScrollOnSwipe` option **supersedes** `touchEventOptions.passive` for the `touchmove` event listener

**Example scenario:**
> If a user is swiping right with props `{ onSwipedRight: userSwipedRight, preventScrollOnSwipe: true }` then `e.preventDefault()` will be called, but if the user was swiping left then `e.preventDefault()` would **not** be called.

`e.preventDefault()` is only called when:
  - `preventScrollOnSwipe: true`
  - `trackTouch: true`
  - the users current swipe has an associated `onSwiping` or `onSwiped` handler/prop

Please experiment with the [example app](http://formidablelabs.github.io/react-swipeable/) to test `preventScrollOnSwipe`.

#### passive listener details
Swipeable adds the passive event listener option, by default, to **internal uses** of touch `addEventListener`'s. We set the `passive` option to `false` only when `preventScrollOnSwipe` is `true` and only to `touchmove`. Other listeners will retain `passive: true`.

**When `preventScrollOnSwipe` is:**
  - `true`  => `el.addEventListener('touchmove', cb, { passive: false })`
  - `false` => `el.addEventListener('touchmove', cb, { passive: true })`

Here is more information on react's long running passive [event issue](https://github.com/facebook/react/issues/6436).

We previously had issues with chrome lighthouse performance deducting points for not having passive option set so it is now on by default except in the case mentioned above.

If, however, you really **need** _all_ of the listeners to be passive (for performance reasons or otherwise), you can prevent all scrolling on the swipeable container by using the `touch-action` css property instead, [see below for an example](#how-to-use-touch-action-to-prevent-scrolling).

### Version 7 Updates and migration

If upgrading from v6 refer to the release notes and the [migration doc](./migration.md).

## FAQs

### How can I add a swipe listener to the `document`?
Example by [@merrywhether #180](https://github.com/FormidableLabs/react-swipeable/issues/180#issuecomment-649677983)

##### Example codesandbox with swipeable on document and nested swipe
https://codesandbox.io/s/react-swipeable-document-swipe-example-1yvr2v

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

Sometimes you don't want the `body` of your page to scroll along with the user manipulating or swiping an item. Or you might want all of the internal event listeners to be passive and performant.

You can prevent scrolling via [preventScrollOnSwipe](#preventscrollonswipe-details), which calls `event.preventDefault()` during `onTouchMove`. **But** there may be a simpler, more effective solution, which has to do with a simple CSS property.

`touch-action` is a CSS property that sets how an element's region can be manipulated by a touchscreen user. See the [documentation for `touch-action`](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) to determine which property value to use for your particular use case.

#### Static example
```js
const handlers = useSwipeable({
  onSwiped: (eventData) => console.log("User Swiped!", eventData),
  ...config,
});

return <div {...handlers} style={{ touchAction: 'pan-y' }}>Swipe here</div>;
```
This explanation and example borrowed from `use-gesture`'s [wonderful docs](https://use-gesture.netlify.app/docs/extras/#touch-action).

#### Dynamic example
```js
const MySwipeableComponent = props => {
  const [stopScroll, setStopScroll] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => setStopScroll(true),
    onSwiped: () => setStopScroll(false)
  });

  return <div {...handlers} style={{ touchAction: stopScroll ? 'none' : 'auto' }}>Swipe here</div>;
};
```

This is a somewhat contrived example as the final outcome would be similar to the static example. However, there may be cases where you want to determine when the user can scroll based on the user's swiping action along with any number of variables from state and props.

## License

[MIT]((./LICENSE))

## Contributing

Please see our [contributions guide](./CONTRIBUTING.md).

### Maintainers
[Project Maintenance](./CONTRIBUTING.md#project-maintainers)

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome.
