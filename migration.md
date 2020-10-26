# React Swipeable v6 changes and migration

## Major Changes

- **remove** `<Swipeable>` component, see below for examples on how to make your own
  - [Swipeable component examples](#swipeable-component-examples)
- **event data update** correctly calculate `deltaX` and `deltaY`
  - from `initial - current` **to** `current - initial`
- **drop direct support for ie11** can be fixed with a polyfill
  - `addEventListener` options need to be polyfilled for ie11, [browser support](./README.md#browser-support)
- **requires** react >= 16.8.3, additionally supports new react v17

### Typescript changes
- **changed** `EventData` -> `SwipeEventData` - The event data provided for all swipe event callbacks
- **removed** `SwipeableOptions` - use `SwipeableProps` now
- **removed** all types associated with `<Swipeable>` component

#### Browser Support

With the release of v6 `react-swipeable` only supports browsers that support options object for `addEventListener`, [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility). Which mainly means `react-swipeable` does not support ie11 by default, you need to polyfill options. For example using [event-listener-with-options](https://github.com/Macil/event-listener-with-options).

## Migrate Swipeable v5 to v6

### Swipeable component examples

You should be able to recreate all `≤Swipeable>` use cases with the `useSwipeable` hook. If you find you're unable please reach out via an issue and we'll explore other possibilities.

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
