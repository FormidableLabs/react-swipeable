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
    const baseText = "🧙 You swiped";
    switch (eventData.dir) {
      case "Down":
        changeText(`${baseText} ⬇️!`);
        break;
      case "Left":
        changeText(`${baseText} ⬅️!`);
        break;
      case "Right":
        changeText(`${baseText} ➡️!`);
        break;
      case "Up":
        changeText(`${baseText} ⬆️!`);
      default:
        break;
    }
    console.log(`${baseText} ${eventData.dir}. Event data 👇`);
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
        <PatternBox className="card self-center text-center" {...handlers}>
          <div className="card__header">
            <h3>👆 Swipeable Box 👆</h3>
          </div>
          <div className="card__body">
            Swipe within this box to test the <code>useSwipeable</code> hook.
            Open the browser console window to see the event details.
          </div>

          <div className="card__footer">{swipeText}</div>
        </PatternBox>
      </div>
    </>
  );
}

export default SwipeDemo;
