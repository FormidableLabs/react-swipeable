Migrate Swipeable v4 to v5
=========================

### Simple Component usage:
The component usage for swiped events is the same except `eventData` can now be destructured and `isFlick` is deprecated, [see below](#flickThreshold).
```diff
- import Swipeable from 'react-swipeable';
+ import { Swipeable } from 'react-swipeable;


- swiped = (event, deltaX, deltaY, isFlick, velocity) => {
+ swiped = ({ event, deltaX, deltaY, velocity }) => {

- swipedUp = (event, deltaY, isFlick) => {
+ swipedUp = ({ event, deltaY }) => {

- swipedRight = (event, deltaX, isFlick) => {
+ swipedRight = ({ event, deltaX }) => {

<Swipeable
  onSwiped={this.swiped}
  onSwipedUp={this.swipedUp}
  onSwipedRight={this.swipedRight}
/>
```

### Swiping direction usage:
The props for swiping directions have been removed. Please use the newly provided `dir` property in the `eventData` from `onSwiping` to determine direction. We also provided directional constants you can import.
```diff
- import Swipeable from 'react-swipeable';
+ import {
+   Swipeable,
+   LEFT,
+   RIGHT,
+   UP,
+   DOWN,
+ } from 'react-swipeable;

+ const onSwiping = ({ dir }) => {
+   if (dir === LEFT)  console.log('Swiping - LEFT');
+   if (dir === RIGHT) console.log('Swiping - RIGHT');
+   if (dir === UP)    console.log('Swiping - UP');
+   if (dir === DOWN)  console.log('Swiping - DOWN');
+ }

<Swipeable
-   onSwipingLeft={swipingLeft}
-   onSwipingRight={swipingRight}
-   onSwipingUp={swipingUp}
-   onSwipingDown={swipingDown}
+   onSwiping={(eventData) => onSwiping(eventData) }
  />
```

### Deprecated props
With the v5 core rewrite we dropped a few props that seemed superfluous.

```diff
<Swipeable
-   flickThreshold
-   stopPropagation
-   disabled
-   onSwipingLeft={swipingLeft}
-   onSwipingRight={swipingRight}
-   onSwipingUp={swipingUp}
-   onSwipingDown={swipingDown}
  />
```
#### flickThreshold
`flickThreshold` and the associated `isFlick` functionality can be still be obtained using any of the `onSwiped[direction]` handlers.
```js
// The old default
const flickThreshold = 0.6;
onSwipedLeft = (eventData) => {
  if (eveData.velocity > flickThreshold) {
    console.log('swipe was a flick');
  }
}
```

#### stopPropagation
Since `Swipeable` provides the `event` for all handlers you can just call `event.stopPropagation()` whenever you need.

#### disabled
You can just stop tracking any hanlder or turn off the component or hook yourself when you want it disabled.

#### onSwiping[direction]
Please see above [example migration](./migration#swiping-direction-usage).

### Comments suggestions
Please do not hesitate to [create an issue](https://github.com/dogfessional/react-swipeable/issues/new) using the provided templates to discuss bugs, ideas and/or any feedback.

If you feel that we removed a prop or functionality you truly depended on lets have a [conversation](https://github.com/dogfessional/react-swipeable/issues/new) about adding it back.

Cheers!
