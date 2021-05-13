# v6.1.2
* Maintenance
  * actually include dependabot security updates
  * update badge links

# v6.1.1
* Maintenance
  * ~dependabot security updates~
  * Migrate to github actions, remove travis, update badges
  * Update examples and provide link via codesandbox

# v6.1.0
* Add new event handler prop `onSwipeStart`
  * called only once per swipe at the start and before the first `onSwiping` callback
    * The `first` property of the `SwipeEventData` will be `true`
  * [PR #226](https://github.com/formidablelabs/react-swipeable/pull/226)
  * Thank you [@feketegy](https://github.com/feketegy) for the idea!

* **typescript** updated to `v4.1.3` and associated deps bumped to be compatible
  * [PR #228](https://github.com/formidablelabs/react-swipeable/pull/228)
  * Thank you [@cwise89](https://github.com/cwise89)!

# v6.0.1
* Fix issue with `first` property on `SwipeEventData` always being `true`.
  * `first` is now only `true` for the first event, then `false` for subsequent events
  * [issue #221](https://github.com/formidablelabs/react-swipeable/issues/221) and [PR #223](https://github.com/formidablelabs/react-swipeable/pull/223)
  * Thank you [@feketegy](https://github.com/feketegy)!

# v6.0.0
**New Features:**
- include passive event listener option, by default, to internal uses of `addEventListener`
  - solves issue with chrome and lighthouse - [#167](https://github.com/FormidableLabs/react-swipeable/issues/167)
  - set `passive` to `false` only when `preventDefaultTouchmoveEvent` is `true`.
  - more details in [readme#passive-listener-issue](https://github.com/FormidableLabs/react-swipeable#passive-listener)
- add new `onTap` event handler prop which executes its callback after a tap
  - Thank you [@upatel32](https://github.com/upatel32)!
- add new `vxvy` event data property
  - `[ deltaX/time, deltaY/time]` - velocity per axis
  - Thank you [@upatel32](https://github.com/upatel32)!

**Breaking Changes:**
- **remove** `<Swipeable>` component
  - see below for an example of how to make your own
  - [Swipeable component examples](https://github.com/FormidableLabs/react-swipeable/blob/main/migration.md#swipeable-component-examples)
- **event data update** correctly calculate `deltaX` and `deltaY`
  - from `initial - current` **to** `current - initial`
  - fixes issue [#157](https://github.com/FormidableLabs/react-swipeable/issues/157)
  - Thank you [@upatel32](https://github.com/upatel32)!
- **drop support for ie11**
  - using `addEventListener` options object needs to be polyfilled, [browser support](https://github.com/FormidableLabs/react-swipeable#browser-support)
- **requires** react >= 16.8.3, additionally supports new react v17

**Bug fixes:**
- Swipes can now start at edges (x or y === 0)
  - fixes [#182](https://github.com/FormidableLabs/react-swipeable/issues/182)
  - Thank you [@upatel32](https://github.com/upatel32)!

**Infrastructure:**
- **typescript** Converted entire code base, tests, and examples to typescript
  - **changed type** `EventData` -> `SwipeEventData` - The event data provided for all swipe event callbacks
  - **removed type** `SwipeableOptions` - use `SwipeableProps` now
  - **removed types** associated with `<Swipeable>` component
  - **new type** `TapCallback` - callback for the new `onTap` prop handler
  - **new type** `SwipeDirections` - `"Left" | "Right" | "Up" | "Down"`
- Converted tests to `@testing-library/react`, [react testing library](https://github.com/testing-library/react-testing-library)
- Build bundles with `microbundle`. [microbundle](https://github.com/developit/microbundle)
  - export new "modern" build - via package.json `esmodule` property
    - [microbundle modern mode](https://github.com/developit/microbundle#-modern-mode-)

**Maintenance:**
- Upgraded all dev dependencies, `jest`, `babel`, `webpack`, `eslint`, `prettier`

# 5.5.0
* Add `first` property to `eventData` that is `true` for first swipe event [issue #160](https://github.com/formidablelabs/react-swipeable/issues/160) and [PR #162](https://github.com/formidablelabs/react-swipeable/pull/162)
  * Thank you [@samanpwbb](https://github.com/samanpwbb)!

# 5.4.0
* Add `initial` property to `eventData` that supplies the inital `[x, y]` swipe value coordinates [issue #150](https://github.com/formidablelabs/react-swipeable/issues/150) and [PR #131](https://github.com/formidablelabs/react-swipeable/pull/151)

# 5.3.0
* Optimization for `useSwipeable` hook. Added `useMemo` for handler internals [issue #134](https://github.com/formidablelabs/react-swipeable/issues/134) and [PR #149](https://github.com/formidablelabs/react-swipeable/pull/149)
  * Thank you [@FaberVitale](https://github.com/FaberVitale)!

# 5.2.3
* Add check for `event.cancelable` for `touchmove` events before calling `event.preventDefault()`, [issue #128](https://github.com/formidablelabs/react-swipeable/issues/128) and [PR #145](https://github.com/formidablelabs/react-swipeable/pull/145)
  * Thank you [@maurispalletti](https://github.com/maurispalletti)!

# 5.2.2
* Fix typescript types for `ref`, [issue #140](https://github.com/formidablelabs/react-swipeable/issues/140) and [PR #142](https://github.com/formidablelabs/react-swipeable/pull/142)
  * Thank you [@mastermatt](https://github.com/mastermatt)!

# 5.2.0
* Fix bug where callbacks/props were not refreshed for `useSwipeable` and `<Swipeable>`,  [issue #136](https://github.com/formidablelabs/react-swipeable/issues/136) and [PR #138](https://github.com/formidablelabs/react-swipeable/pull/138)
  * Thank you [@caesarsol](https://github.com/caesarsol) and [@bas-l](https://github.com/bas-l)!
* Add typescript types for `useSwipeable` and `<Swipeable>`,  [issue #125](https://github.com/formidablelabs/react-swipeable/issues/125)
  * Thank you [@adambowles](https://github.com/adambowles)!

# 5.1.0
* Fix for `preventDefaultTouchmoveEvent` in safari [issue #127](https://github.com/formidablelabs/react-swipeable/issues/127) and [PR #131](https://github.com/formidablelabs/react-swipeable/pull/131)
  * Thank you [@JiiB](https://github.com/JiiB) and [@bhj](https://github.com/bhj)!
  * use `ref` callback for both `<Swipeable>` and `useSwipeable` to attach all touch event handlers
    * `useSwipeable`'s returned `handlers` now contains a ref callback
    * Please see disscusion and comments in both [#127](https://github.com/formidablelabs/react-swipeable/issues/127) and [#131](https://github.com/formidablelabs/react-swipeable/issues/127) for more details and info.
      * fix avoids the `passive: true` issue from chrome document event listeners
      * fix avoids bug on safari where the `touchmove` event listener needs to be attached before a `touchstart` in order to be able to call `e.preventDefault`
* removed `touchHandlerOption` prop
  * fix above deprecates this prop

# 5.0.0
* Introduce react hook, `useSwipeable`
* Core rewrite to simplify api and trim down bundled size
* Add `size-limit` to help keep bundled size down
* Add `es` export via `"module": "es/index.js"` to `package.json`
* Add `prettier` code formating
* **[BREAKING]** simplify handler event data to allow destructuring
  * `onSwiped = ({ event, direction, absX, absY, velocity}) => console.log('swiped')`
* **[BREAKING]** deprecated `onSwiping{Left|Right|Up|Down}` handler props
  * can be replaced with direction/`dir` event data
  * `` onSwiping = ({ dir }) => console.log(`swiping - ${dir}`) ``
* **[BREAKING]** deprecated props
  * `flickThreshold`
  * `stopPropagation`
  * `disabled`
* **[BREAKING]** deprecated passing "rest" of props down
  * removed additional props besides the ones used by `<Swipeable>` from being passed down
    * only `className` and `style` get passed to `<Swipeable>`'s dom node, default `div`



# 4.3.0
* Add `rotationAngle` prop. [#103](https://github.com/formidablelabs/react-swipeable/pull/103)
  * will allow to set a rotation angle, e.g. for a four-player game on a tablet, where each player has a 90° turned view.
  * Thank you [@Narquadah](https://github.com/Narquadah) and [@LarsKumbier](https://github.com/LarsKumbier)!

# 4.2.2
* fixed bug that happened when if either `onSwiping` or `onSwiped` were set we were not calling `e.preventDefault()` appropriately

# 4.2.0
* Add support for calling `preventDefault` on Chrome 56+ via passive event support checking and manual event listener setup. [#88](https://github.com/formidablelabs/react-swipeable/pull/88)
  * Thank you [@kl0tl](https://github.com/kl0tl) and [@KrashStudio](https://github.com/KrashStudio)!

# 4.1.0
* add `disabled` prop. [#83](https://github.com/formidablelabs/react-swipeable/pull/83)
* add `innerRef` prop that allows user to access to `<Swipeable>`'s inner dom node react ref. [#82](https://github.com/formidablelabs/react-swipeable/pull/82)

# 4.0.1
* fixed bug where delta was causing a swipe to not be tracked correctly, #74 , thanks @mctep

# 4.0.0

* **Major Change** `preventDefaultTouchmoveEvent` defaults to `false` now [#69](https://github.com/formidablelabs/react-swipeable/issue/69)
  * This change is in part due to a [Chrome56+ change](https://github.com/formidablelabs/react-swipeable#chrome-56-and-later-warning-with-preventdefault)
* **Major Change** drop support for React 12 & 13, `peerDependencies` updated [#64](https://github.com/formidablelabs/react-swipeable/pull/64)
  * `prop-types` added to `dependencies` [#64](https://github.com/formidablelabs/react-swipeable/pull/64)
* **Major Change** `trackMouse` now 'tracks' the swipe outside of the swipeable component, [#67](https://github.com/formidablelabs/react-swipeable/pull/67).
  * Thanks for example [@TanaseHagi](https://github.com/TanaseHagi)
* react 16 added to `peerDependencies`

# 3.9.0

* add `onTap` functionality. Thanks [@anicke](https://github.com/anicke) . [#61](https://github.com/formidablelabs/react-swipeable/pull/61) [#39](https://github.com/formidablelabs/react-swipeable/issues/39)
* added persisting synthetic event in example via `e.persist()`. This should help people see more details in the console when debugging in the [example](http://stack.formidable.com/react-swipeable/.

# 3.8.0

* Allow `onMouseDown`, `onMouseUp`, and `onMouseMove` props to fire appropriately again. [#55](https://github.com/formidablelabs/react-swipeable/pull/55), thanks [@lochstar](https://github.com/lochstar)
* Stop using this.state to track swipes, thanks [@grantila](https://github.com/grantila) for pointing out this change and submitting PR, [#58](https://github.com/formidablelabs/react-swipeable/pull/58). Should provide minor performance gains since `Swipeable` will no longer be calling `this.setState` internally.

# 3.7.0

* add ability to track mouse events as touch events. Thanks [@jakepusateri](https://github.com/jakepusateri) and [@Marcel-G](https://github.com/Marcel-G). [#51](https://github.com/formidablelabs/react-swipeable/issues/51)

# 3.6.0

* add stopPropagation prop for all swipe events, defaults to `false`. See [#46](https://github.com/formidablelabs/react-swipeable/issues/46) for more info.

# 3.5.1

* fix React 15.2.0 warning for unknown properties on DOM elements

# 3.5.0

* Add configurable container element via `nodeName` prop, defaults to `'div'`. See [#24](https://github.com/formidablelabs/react-swipeable/issues/24) and [#40](https://github.com/formidablelabs/react-swipeable/pull/40) for more info.

# 3.4.0

* Add preventDefault while swiping when props `onSwipedLeft`, `onSwipedRight`, `onSwipedUp`, and `onSwipedDown` are present. See [#21](https://github.com/formidablelabs/react-swipeable/issues/21) and [#37](https://github.com/formidablelabs/react-swipeable/pull/37) for more info.

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
