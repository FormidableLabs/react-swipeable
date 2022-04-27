import * as React from "react";
import { render, fireEvent, createEvent, act } from "@testing-library/react";
import { useSwipeable } from "../src/index";
import { LEFT, RIGHT, UP, DOWN, SwipeableProps } from "../src/types";
import { expectSwipeFuncsDir, MockedSwipeFunctions } from "./helpers";

const DIRECTIONS: [typeof LEFT, typeof RIGHT, typeof UP, typeof DOWN] = [
  LEFT,
  RIGHT,
  UP,
  DOWN,
];

const touchStart = "touchstart";
const touchMove = "touchmove";
const touchEnd = "touchend";
const touchListeners = [touchStart, touchMove, touchEnd];

function getMockedSwipeFunctions(): MockedSwipeFunctions {
  const onSwiped = "onSwiped";
  return DIRECTIONS.reduce(
    (acc, dir) => ({ ...acc, [onSwiped + dir]: jest.fn() }),
    {
      onSwiping: jest.fn(),
      onSwiped: jest.fn(),
    } as MockedSwipeFunctions
  );
}

const TESTING_TEXT = "touch here";
/*
 * Wrapping component for the hook testing
 */
function SwipeableUsingHook({
  nodeName = "div",
  onRefPassThrough,
  ...rest
}: SwipeableProps & {
  nodeName?: string;
  onRefPassThrough?(el: HTMLElement): void;
}) {
  const eventHandlers = useSwipeable(rest);
  const Elem = nodeName as React.ElementType;

  const refPassthrough = (el: HTMLElement) => {
    onRefPassThrough?.(el);

    // call useSwipeable ref prop with el
    eventHandlers.ref(el);
  };

  return (
    <Elem {...eventHandlers} ref={refPassthrough}>
      <span>{TESTING_TEXT}</span>
    </Elem>
  );
}

const MD = "mouseDown";
const MM = "mouseMove";
const MU = "mouseUp";
const TS = "touchStart";
const TM = "touchMove";
const TE = "touchEnd";
type touchTypes = typeof TS | typeof TM | typeof TE;

const createClientXYObject = (x?: number, y?: number) => ({
  clientX: x,
  clientY: y,
});
type xyObj = { x?: number; y?: number };
// Create touch event
const cte = ({ x, y }: xyObj) => ({
  touches: [createClientXYObject(x, y)],
});
// create touch event with timestamp
const cteTs = ({
  x,
  y,
  timeStamp,
  type,
  node,
}: xyObj & { timeStamp?: number; type: touchTypes; node: HTMLElement }) => {
  const e = createEvent[type](node, cte({ x, y }));
  if (timeStamp) {
    Object.defineProperty(e, "timeStamp", {
      value: timeStamp,
      writable: false,
    });
  }
  return e;
};
// Create Mouse Event
const cme = ({ x, y }: xyObj) => ({
  ...createClientXYObject(x, y),
});

describe("useSwipeable", () => {
  let defaultPrevented = 0;

  beforeAll(() => {
    // listen on document for touchmove events, track if their default was prevented
    document.addEventListener("touchmove", (e) => {
      if (e.defaultPrevented) {
        defaultPrevented += 1;
      }
    });
  });

  beforeEach(() => {
    defaultPrevented = 0;
  });

  it("handles onTap callbacks", () => {
    const onTap = jest.fn();
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText } = render(
      <SwipeableUsingHook {...swipeFuncs} onTap={onTap} />
    );
    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TE](touchArea, cte({ x: 100, y: 100 }));

    expect(onTap).toHaveBeenCalled();
  });

  it("handles touch events that start at clientX or clientY 0", () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText } = render(<SwipeableUsingHook {...swipeFuncs} />);

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 0, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 0, y: 125 }));
    fireEvent[TE](touchArea, cte({}));
    fireEvent[TS](touchArea, cte({ x: 100, y: 0 }));
    fireEvent[TM](touchArea, cte({ x: 125, y: 0 }));
    fireEvent[TE](touchArea, cte({}));

    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(2);
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(2);
  });

  it("handles touch events and fires correct props", () => {
    const onTap = jest.fn();
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText } = render(
      <SwipeableUsingHook {...swipeFuncs} onTap={onTap} />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 175 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    expect(swipeFuncs.onSwipedDown).toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped.mock.calls[0][0]).toMatchSnapshot(
      {
        velocity: expect.any(Number),
        vxvy: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
      },
      `useSwipeable onSwiped trackTouch`
    );
    expect(swipeFuncs.onSwiping.mock.calls[0][0]).toMatchSnapshot(
      {
        velocity: expect.any(Number),
        vxvy: expect.arrayContaining([expect.any(Number), expect.any(Number)]),
      },
      `useSwipeable onSwiping trackTouch`
    );
    expect(onTap).not.toHaveBeenCalled();
  });

  it("skips touch events with more than 1 touch", () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText } = render(<SwipeableUsingHook {...swipeFuncs} />);

    const touchArea = getByText(TESTING_TEXT);

    const setupMultipleTouchEvent = (
      touches: { x?: number; y?: number }[]
    ) => ({
      touches: touches.map((t) => createClientXYObject(t.x, t.y)),
    });

    fireEvent[TS](touchArea, cte({ x: 100, y: 10 }));
    fireEvent[TM](
      touchArea,
      setupMultipleTouchEvent([
        { x: 125, y: 0 },
        { x: 130, y: 10 },
      ])
    );
    fireEvent[TM](
      touchArea,
      setupMultipleTouchEvent([
        { x: 130, y: 0 },
        { x: 135, y: 10 },
      ])
    );
    fireEvent[TE](touchArea, cte({}));

    fireEvent[TS](
      touchArea,
      setupMultipleTouchEvent([
        { x: 100, y: 0 },
        { x: 110, y: 10 },
      ])
    );
    fireEvent[TM](
      touchArea,
      setupMultipleTouchEvent([
        { x: 125, y: 0 },
        { x: 130, y: 10 },
      ])
    );
    fireEvent[TM](
      touchArea,
      setupMultipleTouchEvent([
        { x: 130, y: 0 },
        { x: 135, y: 10 },
      ])
    );
    fireEvent[TE](touchArea, cte({}));

    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(0);
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(0);
  });

  it("handles touch events and fires correct props with undefined values for config", () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const undefinedConfigOptions: SwipeableProps = {
      delta: undefined,
      preventScrollOnSwipe: undefined,
      rotationAngle: undefined,
      trackMouse: undefined,
      trackTouch: undefined,
      swipeDuration: undefined,
      touchEventOptions: undefined,
    };
    const { getByText } = render(
      <SwipeableUsingHook {...swipeFuncs} {...undefinedConfigOptions} />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TE](touchArea, cte({}));

    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(2);
  });

  it("handles mouse events with trackMouse prop and fires correct props", () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText } = render(
      <SwipeableUsingHook
        {...swipeFuncs}
        trackMouse={true}
        trackTouch={false}
      />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[MD](touchArea, cme({ x: 100, y: 100 }));
    fireEvent[MM](touchArea, cme({ x: 125, y: 100 }));
    fireEvent[MM](touchArea, cme({ x: 150, y: 100 }));
    fireEvent[MM](touchArea, cme({ x: 175, y: 100 }));
    fireEvent[MM](touchArea, cme({ x: 200, y: 100 }));
    fireEvent[MU](document, cme({}));

    expect(swipeFuncs.onSwipedRight).toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped.mock.calls[0][0]).toMatchSnapshot(
      { velocity: expect.any(Number), vxvy: expect.any(Array) },
      `useSwipeable onSwiped trackMouse`
    );
    expect(swipeFuncs.onSwiping.mock.calls[0][0]).toMatchSnapshot(
      { velocity: expect.any(Number), vxvy: expect.any(Array) },
      `useSwipeable onSwiping trackMouse`
    );
  });

  it("correctly tracks the first event for swipes", () => {
    const onSwiping = jest.fn();
    const { getByText } = render(<SwipeableUsingHook onSwiping={onSwiping} />);

    const touchArea = getByText(TESTING_TEXT);

    // first swipe
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 175 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiping.mock.calls[0][0]).toEqual(
      expect.objectContaining({ first: true })
    );
    expect(onSwiping.mock.calls[1][0]).toEqual(
      expect.objectContaining({ first: false })
    );
    expect(onSwiping.mock.calls[2][0]).toEqual(
      expect.objectContaining({ first: false })
    );

    // second swipe
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 125, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 150, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 175, y: 175 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiping.mock.calls[3][0]).toEqual(
      expect.objectContaining({ first: true })
    );
    expect(onSwiping.mock.calls[4][0]).toEqual(
      expect.objectContaining({ first: false })
    );
    expect(onSwiping.mock.calls[5][0]).toEqual(
      expect.objectContaining({ first: false })
    );
  });

  it("calls onTouchStartOrOnMouseDown and onTouchEndOrOnMouseUp for touch or mouse events", () => {
    const onTouchStartOrOnMouseDownMock = jest.fn();
    const onTouchEndOrOnMouseUpMock = jest.fn();
    const { getByText, rerender } = render(
      <SwipeableUsingHook
        onTouchStartOrOnMouseDown={onTouchStartOrOnMouseDownMock}
        onTouchEndOrOnMouseUp={onTouchEndOrOnMouseUpMock}
        trackMouse={true}
        trackTouch={false}
      />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[MD](touchArea, cme({ x: 100, y: 100 }));
    fireEvent[MM](touchArea, cme({ x: 125, y: 100 }));
    fireEvent[MU](document, cme({}));

    expect(onTouchStartOrOnMouseDownMock).toHaveBeenCalled();
    expect(onTouchStartOrOnMouseDownMock.mock.calls[0][0].event.type).toEqual(
      "mousedown"
    );
    expect(onTouchEndOrOnMouseUpMock).toHaveBeenCalled();
    expect(onTouchEndOrOnMouseUpMock.mock.calls[0][0].event.type).toEqual(
      "mouseup"
    );

    rerender(
      <SwipeableUsingHook
        onTouchStartOrOnMouseDown={onTouchStartOrOnMouseDownMock}
        onTouchEndOrOnMouseUp={onTouchEndOrOnMouseUpMock}
      />
    );

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onTouchStartOrOnMouseDownMock).toHaveBeenCalledTimes(2);
    expect(onTouchStartOrOnMouseDownMock.mock.calls[1][0].event.type).toEqual(
      "touchstart"
    );
    expect(onTouchEndOrOnMouseUpMock).toHaveBeenCalledTimes(2);
    expect(onTouchEndOrOnMouseUpMock.mock.calls[1][0].event.type).toEqual(
      "touchend"
    );
  });

  it("correctly calls onSwipeStart for first swipe event", () => {
    const onSwipeStart = jest.fn();
    const { getByText } = render(
      <SwipeableUsingHook onSwipeStart={onSwipeStart} />
    );

    const touchArea = getByText(TESTING_TEXT);

    // first swipe
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 175 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipeStart).toHaveBeenCalledTimes(1);

    // second swipe
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 125, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 150, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 175, y: 175 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipeStart).toHaveBeenCalledTimes(2);
  });

  it("calls callbacks appropriately for swipeDuration", () => {
    const onSwiped = jest.fn();
    const onSwiping = jest.fn();
    const { getByText, rerender } = render(
      <SwipeableUsingHook
        onSwiped={onSwiped}
        onSwiping={onSwiping}
        swipeDuration={15}
      />
    );

    const el = getByText(TESTING_TEXT);
    const fE = fireEvent;

    fE(el, cteTs({ x: 100, y: 100, node: el, type: TS, timeStamp: 1000 }));
    fE(el, cteTs({ x: 100, y: 125, node: el, type: TM, timeStamp: 1010 }));
    fE(el, cteTs({ x: 100, y: 150, node: el, type: TM, timeStamp: 1020 }));
    fE(el, cteTs({ x: 100, y: 175, node: el, type: TM, timeStamp: 1030 }));
    fE(el, cteTs({ node: el, type: TE, timeStamp: 1040 }));

    expect(onSwiping).toHaveBeenCalledTimes(1);
    expect(onSwiped).not.toHaveBeenCalled();

    onSwiping.mockClear();
    onSwiped.mockClear();
    rerender(
      <SwipeableUsingHook
        onSwiped={onSwiped}
        onSwiping={onSwiping}
        swipeDuration={50}
      />
    );

    fE(el, cteTs({ x: 100, y: 100, node: el, type: TS, timeStamp: 1000 }));
    fE(el, cteTs({ x: 100, y: 125, node: el, type: TM, timeStamp: 1010 }));
    fE(el, cteTs({ x: 100, y: 150, node: el, type: TM, timeStamp: 1020 }));
    fE(el, cteTs({ x: 100, y: 175, node: el, type: TM, timeStamp: 1030 }));
    fE(el, cteTs({ node: el, type: TE, timeStamp: 1040 }));

    expect(onSwiping).toHaveBeenCalledTimes(3);
    expect(onSwiped).toHaveBeenCalled();
  });

  it("calls preventDefault when swiping in direction with callback defined", () => {
    const onSwipedDown = jest.fn();

    const { getByText, rerender } = render(
      <SwipeableUsingHook onSwipedDown={undefined} preventScrollOnSwipe />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    // Validate `undefined` does not trigger defaultPrevented
    expect(onSwipedDown).not.toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);

    rerender(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} preventScrollOnSwipe />
    );

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 175 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedDown).toHaveBeenCalled();
    expect(defaultPrevented).toBe(4);
  });

  it("does not call preventDefault when false", () => {
    const onSwipedUp = jest.fn();

    const { getByText } = render(
      <SwipeableUsingHook onSwipedUp={onSwipedUp} />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 75 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 50 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 25 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 5 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedUp).toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);
  });

  it("calls preventDefault when onSwiping or onSwiped is present", () => {
    const onSwiping = jest.fn();
    const onSwiped = jest.fn();

    const { getByText, rerender } = render(
      <SwipeableUsingHook onSwiping={onSwiping} preventScrollOnSwipe />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 50 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiping).toHaveBeenCalled();
    expect(defaultPrevented).toBe(1);

    rerender(<SwipeableUsingHook onSwiped={onSwiped} preventScrollOnSwipe />);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 50 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiped).toHaveBeenCalled();
    expect(defaultPrevented).toBe(2);
  });

  it("calls preventDefault appropriately when preventScrollOnSwipe value changes", () => {
    const onSwipedDown = jest.fn();

    const { getByText, rerender } = render(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} preventScrollOnSwipe />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));

    // change preventScrollOnSwipe in middle of swipe
    rerender(
      <SwipeableUsingHook
        onSwipedDown={onSwipedDown}
        preventScrollOnSwipe={false}
      />
    );

    fireEvent[TM](touchArea, cte({ x: 100, y: 175 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedDown).toHaveBeenCalled();
    expect(defaultPrevented).toBe(2);
  });

  it("defaults touchEventOptions passive", () => {
    const onSwiping = jest.fn();

    let addEventListenerSpy: jest.SpyInstance | undefined;
    const onRefPassThrough = (el: HTMLElement) => {
      if (el === null) return;
      // re-assign to element and spy
      addEventListenerSpy = jest.spyOn(el, "addEventListener");
    };

    render(
      <SwipeableUsingHook
        onSwiping={onSwiping}
        onRefPassThrough={onRefPassThrough}
      />
    );

    // NOTE: this is what addEventListenerSpy.mock.calls looks like:
    // [
    //   [ 'touchstart', [Function: onStart], { passive: true } ],
    //   [ 'touchmove', [Function: onMove], { passive: true } ],
    //   [ 'touchend', [Function: onEnd], { passive: true } ]
    // ]
    expect(addEventListenerSpy?.mock.calls.length).toBe(3);
    const calls = addEventListenerSpy?.mock.calls || [];
    touchListeners.forEach((l, idx) => {
      const [arg1, , arg3] = calls[idx] as any[];
      expect(arg1).toBe(l);
      expect(arg3).toEqual({ passive: true });
    });

    expect(onSwiping).not.toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);
  });

  it("preventScrollOnSwipe overwrites touchEventOptions passive", () => {
    const onSwiping = jest.fn();

    let addEventListenerSpy: jest.SpyInstance | undefined;
    const onRefPassThrough = (el: HTMLElement) => {
      if (el === null) return;
      // re-assign to element and spy
      addEventListenerSpy = jest.spyOn(el, "addEventListener");
    };

    render(
      <SwipeableUsingHook
        onSwiping={onSwiping}
        onRefPassThrough={onRefPassThrough}
        preventScrollOnSwipe
      />
    );

    expect(addEventListenerSpy?.mock.calls.length).toBe(3);
    const calls = addEventListenerSpy?.mock.calls || [];
    touchListeners.forEach((l, idx) => {
      const [arg1, , arg3] = calls[idx] as any[];
      expect(arg1).toBe(l);
      if (l === touchMove) {
        // preventScrollOnSwipe overrides passive for touchmove
        expect(arg3).toEqual({ passive: false });
      } else {
        expect(arg3).toEqual({ passive: true });
      }
    });

    expect(onSwiping).not.toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);
  });

  it("changing touchEventOptions.passive re-attaches event listeners", () => {
    const onSwiping = jest.fn();

    // set to document to start to avoid TS issues
    let addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const onRefPassThrough = (el: HTMLElement) => {
      if (el === null) return;
      // re-assign to element and spy
      addEventListenerSpy = jest.spyOn(el, "addEventListener");
    };

    const { rerender } = render(
      <SwipeableUsingHook
        onSwiping={onSwiping}
        onRefPassThrough={onRefPassThrough}
      />
    );

    expect(addEventListenerSpy.mock.calls.length).toBe(3);
    let calls = addEventListenerSpy.mock.calls;
    touchListeners.forEach((l, idx) => {
      const call: any = calls[idx];
      expect(call[0]).toBe(l);
      expect(call[2]).toEqual({ passive: true });
    });

    expect(onSwiping).not.toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);

    // reset spy before re-render
    addEventListenerSpy.mockClear();

    // change touchEventOptions.passive from default
    rerender(
      <SwipeableUsingHook
        onSwiping={onSwiping}
        onRefPassThrough={onRefPassThrough}
        touchEventOptions={{ passive: false }}
      />
    );

    expect(addEventListenerSpy.mock.calls.length).toBe(3);
    calls = addEventListenerSpy.mock.calls;
    touchListeners.forEach((l, idx) => {
      const call: any = calls[idx];
      expect(call[0]).toBe(l);
      expect(call[2]).toEqual({ passive: false });
    });

    expect(onSwiping).not.toHaveBeenCalled();
    expect(defaultPrevented).toBe(0);
  });

  it("does not fire onSwiped when under delta", () => {
    const onSwiped = jest.fn();
    const { getByText } = render(
      <SwipeableUsingHook onSwiped={onSwiped} delta={40} />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 120, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 130, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiped).not.toHaveBeenCalled();
  });

  it("does not re-check delta when swiping already in progress", () => {
    const onSwiping = jest.fn();
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const { getByText } = render(
      <SwipeableUsingHook
        onSwiping={onSwiping}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        delta={40}
      />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 145, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 80, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiping).toHaveBeenCalledTimes(2);
    expect(onSwiping.mock.calls[0][0].dir).toBe(RIGHT);
    expect(onSwiping.mock.calls[1][0].dir).toBe(LEFT);
    expect(onSwipedLeft).toHaveBeenCalledTimes(1);
    expect(onSwipedRight).not.toHaveBeenCalled();
  });

  it("allows different delta for each side", () => {
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const onSwipedUp = jest.fn();
    const onSwipedDown = jest.fn();
    const { getByText } = render(
      <SwipeableUsingHook
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
        delta={{
          right: 10,
          left: 20,
          up: 30,
          down: 40,
        }}
      />
    );

    const touchArea = getByText(TESTING_TEXT);

    // check right
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 105, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedRight).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 110, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedRight).toHaveBeenCalledTimes(1);

    // check left
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 90, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedLeft).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 80, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedLeft).toHaveBeenCalledTimes(1);

    // check up
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 80 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedUp).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 70 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedUp).toHaveBeenCalledTimes(1);

    // check down
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 130 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedDown).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 140 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedDown).toHaveBeenCalledTimes(1);
  });

  it("defaults delta for side", () => {
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const onSwipedUp = jest.fn();
    const onSwipedDown = jest.fn();
    const { getByText } = render(
      <SwipeableUsingHook
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
        delta={{
          right: 40,
          down: 40,
        }}
      />
    );

    const touchArea = getByText(TESTING_TEXT);

    // check left
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 95, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedLeft).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 90, y: 100 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedLeft).toHaveBeenCalledTimes(1);

    // check up
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 95 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedUp).not.toHaveBeenCalled();

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 90 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedUp).toHaveBeenCalledTimes(1);
  });

  it("Handle Rotation by 90 degree", () => {
    const swipeFuncsRight = getMockedSwipeFunctions();
    const { getByText, rerender } = render(
      <SwipeableUsingHook {...swipeFuncsRight} rotationAngle={90} />
    );

    const touchArea = getByText(TESTING_TEXT);

    // check right
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsRight, RIGHT);

    // check left
    const swipeFuncsLeft = getMockedSwipeFunctions();
    rerender(<SwipeableUsingHook {...swipeFuncsLeft} rotationAngle={90} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 75 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 50 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsLeft, LEFT);

    // check up
    const swipeFuncsUp = getMockedSwipeFunctions();
    rerender(<SwipeableUsingHook {...swipeFuncsUp} rotationAngle={90} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 125, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 150, y: 100 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsUp, UP);

    // check down
    const swipeFuncsDown = getMockedSwipeFunctions();
    rerender(<SwipeableUsingHook {...swipeFuncsDown} rotationAngle={90} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 75, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 50, y: 100 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsDown, DOWN);
  });

  it('Handle "odd" rotations', () => {
    const swipeFuncsNegativeRotation = getMockedSwipeFunctions();
    const { getByText, rerender } = render(
      <SwipeableUsingHook {...swipeFuncsNegativeRotation} rotationAngle={-90} />
    );

    const touchArea = getByText(TESTING_TEXT);

    // check -90
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsNegativeRotation, LEFT);

    // check 360 + 270
    const swipeFuncsLargeRotation = getMockedSwipeFunctions();
    rerender(
      <SwipeableUsingHook
        {...swipeFuncsLargeRotation}
        rotationAngle={360 + 270}
      />
    );
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TE](touchArea, cte({}));
    expectSwipeFuncsDir(swipeFuncsLargeRotation, LEFT);
  });

  it("Handle Rotation that changes so keep the direction the same", () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const { getByText, rerender } = render(
      <SwipeableUsingHook {...swipeFuncs} />
    );

    const touchArea = getByText(TESTING_TEXT);

    // check 0
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 125, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 150, y: 100 }));
    fireEvent[TE](touchArea, cte({}));
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(1);
    expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(1);

    // check 90
    rerender(<SwipeableUsingHook {...swipeFuncs} rotationAngle={90} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 125 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 150 }));
    fireEvent[TE](touchArea, cte({}));
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(2);
    expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(2);

    // check 180
    rerender(<SwipeableUsingHook {...swipeFuncs} rotationAngle={180} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 75, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 50, y: 100 }));
    fireEvent[TE](touchArea, cte({}));
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(3);
    expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(3);

    // check 270
    rerender(<SwipeableUsingHook {...swipeFuncs} rotationAngle={270} />);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 75 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 50 }));
    fireEvent[TE](touchArea, cte({}));
    expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(4);
    expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(4);

    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(8);
    [LEFT, UP, DOWN].forEach((dir) => {
      expect(
        swipeFuncs[`onSwiped${dir}` as keyof MockedSwipeFunctions]
      ).not.toHaveBeenCalled();
    });
  });

  it("Does not track touches when trackTouch is false", () => {
    const onSwipedDown = jest.fn();

    const { getByText, rerender } = render(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} />
    );

    const touchArea = getByText(TESTING_TEXT);

    const doSwipe = () => {
      fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
      fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
      fireEvent[TE](touchArea, cte({}));
    };

    doSwipe();
    expect(onSwipedDown).toHaveBeenCalledTimes(1);

    rerender(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} trackTouch={false} />
    );
    doSwipe();
    // verify we did not trigger another swipe
    expect(onSwipedDown).toHaveBeenCalledTimes(1);

    rerender(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} trackTouch={true} />
    );
    doSwipe();
    expect(onSwipedDown).toHaveBeenCalledTimes(2);
  });

  it("Cleans up and re-attaches touch event listeners if the DOM element changes", () => {
    const onSwipedDown = jest.fn();

    const { getByText, rerender } = render(
      <SwipeableUsingHook onSwipedDown={onSwipedDown} />
    );

    let touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwipedDown).toHaveBeenCalledTimes(1);

    rerender(<SwipeableUsingHook onSwipedDown={onSwipedDown} nodeName="p" />);
    // re-get element since wrapping dom node changed
    touchArea = getByText(TESTING_TEXT);
    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));
    // verify we triggered callbacks on new dom element
    expect(onSwipedDown).toHaveBeenCalledTimes(2);
  });

  it(`handles new prop swipe callbacks from re-renders`, () => {
    const onSwipedSpy = jest.fn();

    function TestHookComponent({ next }: { next: () => void }) {
      const handlers = useSwipeable({ onSwiped: next });
      return <div {...handlers}>{TESTING_TEXT}</div>;
    }

    function TestComponent() {
      const [page, setPage] = React.useState(0);
      // Changing the callback on each re-render ON PURPOSE
      // In order to validate useSwipeable updates prop references
      const next = () => (setPage(page + 1), onSwipedSpy(page + 1));

      return <TestHookComponent next={next} />;
    }

    const { getByText } = render(<TestComponent />);

    const touchArea = getByText(TESTING_TEXT);

    const pages = [1, 2, 3];
    // swipe left 3 times
    pages.forEach(() => {
      act(() => {
        fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
        fireEvent[TM](touchArea, cte({ x: 75, y: 100 }));
        fireEvent[TE](touchArea, cte({}));
      });
    });
    pages.forEach((page, idx) => {
      expect(onSwipedSpy.mock.calls[idx][0]).toBe(page);
    });
  });

  it("Does not trigger onSwiped again clicking document after a previous touch swipe when trackTouch and trackMouse are present", () => {
    // See issue #304
    // - https://github.com/FormidableLabs/react-swipeable/issues/304
    const onSwiped = jest.fn();

    const { getByText } = render(
      <SwipeableUsingHook onSwiped={onSwiped} trackMouse trackTouch />
    );

    const touchArea = getByText(TESTING_TEXT);

    fireEvent[TS](touchArea, cte({ x: 100, y: 100 }));
    fireEvent[TM](touchArea, cte({ x: 100, y: 200 }));
    fireEvent[TE](touchArea, cte({}));

    expect(onSwiped).toHaveBeenCalledTimes(1);

    fireEvent[MD](document, cme({ x: 100, y: 100 }));
    fireEvent[MM](document, cme({ x: 100, y: 100 }));
    fireEvent[MU](document, cme({}));
    // verify we did NOT trigger another swipe
    expect(onSwiped).toHaveBeenCalledTimes(1);
  });
});
