import React, { useState } from "react";
import { PatternBox } from "../components";
import { useSwipeable, SwipeEventData } from "react-swipeable";
import { Divider } from "../../landing/divider";

function SwipeDemo({ showDivider }: { showDivider?: boolean }) {
  const [swipeText, setSwipeText] = useState("🔮 Which way did you swipe? 🔮");

  const changeText = (text) => {
    setSwipeText(text);
  };
  const handleSwiped = (eventData: SwipeEventData) => {
    switch (eventData.dir) {
      case "Down":
        changeText(`🧙 you swiped ⬇️!`);
        break;
      case "Left":
        changeText(`🧙 you swiped ⬅️!`);
        break;
      case "Right":
        changeText(`🧙 you swiped ➡️!`);
        break;
      case "Up":
        changeText(`🧙 you swiped ⬆️!`);
      default:
        break;
    }
    console.log(`you swiped ${eventData.dir}`);
    console.log(eventData);
  };

  const handlers = useSwipeable({
    onSwiped: handleSwiped,
    onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
    touchEventOptions: { passive: false },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });
  return (
    <>
      <div className="flex flex-col text-left mx-16 lg:mx-32 xl:mx-64 my-auto py-12">
        {showDivider && <Divider />}
        <h1 className="my-8 text-4xl font-semibold">Swipe Demo</h1>
        <PatternBox className="card self-center" {...handlers}>
          Swipe within this box to test the useSwipeable hook. Open the browser
          console window to see the event details.
          <p className="text-center">{swipeText}</p>
        </PatternBox>
      </div>
    </>
  );
}

export default SwipeDemo;
