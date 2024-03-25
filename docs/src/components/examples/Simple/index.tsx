import React from "react";
import { PatternBox } from "../components";
import { useSwipeable, SwipeEventData } from "react-swipeable";

function Simple() {
  const handleSwiped = (eventData: SwipeEventData) => {
    // if (eventData.dir === pattern[pIdx]) {
    console.log(`you swiped ${eventData.dir}`);

    // }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwiped,
    onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
    touchEventOptions: { passive: false },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  return (
    <div>
      <h5 style={{ marginBottom: "20px" }}>
        <strong>👉 Swipe pattern</strong>
      </h5>
      <PatternBox {...handlers}>
        Swipe the pattern below, within this box, to make the carousel go to the
        next slide
        <p style={{ textAlign: "center", paddingTop: "15px" }}>Swipe: ⬅️</p>
      </PatternBox>
    </div>
  );
}

export default Simple;
