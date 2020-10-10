# React Swipeable v6 changes and migration

## New Features

- include passive event listener option, by default, to internal uses of `addEventListener`
  - solves issue with chrome and lighthouse - [#167](https://github.com/FormidableLabs/react-swipeable/issues/167)
  - set `passive` to `false` only when `preventDefaultTouchmoveEvent` is `true`.
  - more details in [readme#passive-listener-issue](https://github.com/FormidableLabs/react-swipeable#passive-listener-issue)
- addition of `onTap` event handler prop which executes its callback after a tap
- add new `vxvy` event data property
  - `[ deltaX/time, deltaY/time]` - velocity per axis

## Major Changes

- **remove** `<Swipeable>` component
  - see below for an example of how to make your own
  - [Swipeable component examples](https://github.com/FormidableLabs/react-swipeable/blob/main/migration.md#swipeable-component-examples)
- **event data update** re-calculate `deltaX` and `deltaY`
  - from `initial - current` **to** `current - initial`
  - fixes issue [#157](https://github.com/FormidableLabs/react-swipeable/issues/157)
- **drop support for ie11**
  - using `addEventListener` options object needs to be polyfilled, [browser support](https://github.com/FormidableLabs/react-swipeable#browser-support)
- **requires** react >= 16.8.0

### Bug fixes
- Swipes can now start at edges (x or y === 0)
  - fixes [#182](https://github.com/FormidableLabs/react-swipeable/issues/182)

#### Browser Support

With the release of v6 `react-swipeable` only supports browsers that support options object for `addEventListener`, [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility). Which mainly means `react-swipeable` does not support ie11 by default, you need to polyfill options. For example using [event-listener-with-options](https://github.com/Macil/event-listener-with-options).

## Migrate Swipeable v5 to v6

### Type changes
- **changed** `EventData` -> `SwipeEventData` - The event data provided for all swipe event callbacks
- **new** `TapCallback` - callback for the new `onTap` prop handler
- **new** `SwipeDirections` - all swipe directions: `"Left" | "Right" | "Up" | "Down"`
- **removed** `SwipeableOptions` - can use `SwipeableProps` now
- **removed** all prop types on `SwipeableProps` associated with `<Swipeable>` component

### Swipeable component examples

You should be able to recreate all `≤Swipeable>` use cases with the `useSwipeable` hook.

Notes:
- `nodeName` can be handled by directly changing your custom `Swipeable`'s returned element
- `className` and `style` props can be handled directly

#### Swipeable Simple example
```js
import { useSwipeable } from 'react-swipeable';

export const Swipeable = ({children, ...props}) => {
  const handlers = useSwipeable(props);
  return (<div { ...handlers }>{children}</div>);
}
```

#### Swipeable with innerRef example
```js
import { useSwipeable } from 'react-swipeable';

export const Swipeable = ({children, innerRef, ...props}) => {
  const handlers = useSwipeable(props);
  const refCallback = (ref) => {
    handlers.ref(ref);
    innerRef(ref);
  }
  return (<div { ...handlers } ref={refCallback} >{children}</div>);
}
```
