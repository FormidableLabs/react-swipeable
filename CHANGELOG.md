# 4.1.0
* add `disabled` prop. [#83](https://github.com/dogfessional/react-swipeable/pull/83)
* add `innerRef` prop that allows user to access to `<Swipeable>`'s inner dom node react ref. [#82](https://github.com/dogfessional/react-swipeable/pull/82)

# 4.0.1
* fixed bug where delta was causing a swipe to not be tracked correctly, #74 , thanks @mctep

# 4.0.0

* **Major Change** `preventDefaultTouchmoveEvent` defaults to `false` now [#69](https://github.com/dogfessional/react-swipeable/issue/69)
  * This change is in part due to a [Chrome56+ change](https://github.com/dogfessional/react-swipeable#chrome-56-and-later-warning-with-preventdefault)
* **Major Change** drop support for React 12 & 13, `peerDependencies` updated [#64](https://github.com/dogfessional/react-swipeable/pull/64)
  * `prop-types` added to `dependencies` [#64](https://github.com/dogfessional/react-swipeable/pull/64)
* **Major Change** `trackMouse` now 'tracks' the swipe outside of the swipeable component, [#67](https://github.com/dogfessional/react-swipeable/pull/67).
  * Thanks for example [@TanaseHagi](https://github.com/TanaseHagi)
* react 16 added to `peerDependencies`

# 3.9.0

* add `onTap` functionality. Thanks [@anicke](https://github.com/anicke) . [#61](https://github.com/dogfessional/react-swipeable/pull/61) [#39](https://github.com/dogfessional/react-swipeable/issues/39)
* added persisting synthetic event in example via `e.persist()`. This should help people see more details in the console when debugging in the [example](http://dogfessional.github.io/react-swipeable/).

# 3.8.0

* Allow `onMouseDown`, `onMouseUp`, and `onMouseMove` props to fire appropriately again. [#55](https://github.com/dogfessional/react-swipeable/pull/55), thanks [@lochstar](https://github.com/lochstar)
* Stop using this.state to track swipes, thanks [@grantila](https://github.com/grantila) for pointing out this change and submitting PR, [#58](https://github.com/dogfessional/react-swipeable/pull/58). Should provide minor performance gains since `Swipeable` will no longer be calling `this.setState` internally.

# 3.7.0

* add ability to track mouse events as touch events. Thanks [@jakepusateri](https://github.com/jakepusateri) and [@Marcel-G](https://github.com/Marcel-G). [#51](https://github.com/dogfessional/react-swipeable/issues/51)

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
