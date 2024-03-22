# Examples

## Static example

```jsx
const handlers = useSwipeable({
  onSwiped: (eventData) => console.log("User Swiped!", eventData),
  ...config,
});

return <div {...handlers} style={{ touchAction: 'pan-y' }}>Swipe here</div>;
```
This explanation and example borrowed from `use-gesture`'s [wonderful docs](https://use-gesture.netlify.app/docs/extras/#touch-action).

## Dynamic example

```jsx
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
