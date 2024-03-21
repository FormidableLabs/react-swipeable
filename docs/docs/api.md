# API

## React Swipeable Props

Props for the `react-swipeable` hook

### `onSwiped`

Event created after any swipe

---

### `onSwipedLeft`

Event created after a left swipe

```js
{ // ported from readme
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