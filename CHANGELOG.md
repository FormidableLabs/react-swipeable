# 3.7.0

* add ability to track mouse events as touch events. Thanks ([@jakepusateri](https://github.com/jakepusateri) and ([@Marcel-G](https://github.com/Marcel-G). [#51](https://github.com/dogfessional/react-swipeable/issues/51)

# 3.6.0

* add stopPropagation prop for all swipe events, defaults to `false`. See [#46](https://github.com/dogfessional/react-swipeable/issues/46) for more info.

# 3.5.1

* fix React 15.2.0 warning for unknown properties on DOM elements

# 3.5.0

* Add configurable container element via `nodeName` prop, defaults to `'div'`. See [#24](https://github.com/dogfessional/react-swipeable/issues/24) and [#40](https://github.com/dogfessional/react-swipeable/pull/40) for more info.

# 3.4.0

* Add preventDefault while swiping when props `onSwipedLeft`, `onSwipedRight`, `onSwipedUp`, and `onSwipedDown` are present. See [#21](https://github.com/dogfessional/react-swipeable/issues/21) and [#37](https://github.com/dogfessional/react-swipeable/pull/37) for more info.

# 3.3.0

* Adds `velocity` data to `onSwiping` callback
* Updated the build process introducing ES2015 and babel

# 3.2.0

* Adds `preventDefaultTouchMoveEvent` option, defaults to true

# 3.1.0

* Adds `isFLick` to onSwipe events
* Removes React as a peer dep
* Adds onSwiping events

# 3.0.2

* Fixes onSwipeDown and onSwipeUp events

# 3.0.1

* Fixes vertical swiping

# 3.0.0

* Refactors build into jsx.

# 2.1.0

* Adds onSwipedUp, onSwipedRight, onSwipedDown, onSwipedLeft callbacks.


# 2.0

* `onFlick` prop has been removed.

* `onSwipe` now has a 4th argument for the callback `Boolean isFlick`

* Added a prop `flickThreshold` which allows you to customize at what velocity a flick is detected.
