# FAQ

### Version 7 Updates and migration

If upgrading from v6 refer to the release notes and the [migration doc](./v7-migration).

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
  // Clean up swipeable event listeners
  return () => ref({});
});
```
**Note:** Issues can arise if you forget to clean up listeners - [#332](https://github.com/FormidableLabs/react-swipeable/issues/322)

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