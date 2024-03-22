# API

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