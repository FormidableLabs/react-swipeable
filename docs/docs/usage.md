# Usage

Use the hook and set your swipe(d) handlers.



```jsx
const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
  ...config,
});
return <div {...handlers}> You can swipe here </div>;
```

Spread `handlers` onto the element you wish to track swipes on.