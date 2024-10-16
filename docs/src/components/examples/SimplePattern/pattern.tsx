import React, { FunctionComponent, ReactNode } from "react";
import { useSwipeable, UP, DOWN, SwipeEventData } from "react-swipeable";
import {
  Wrapper,
  CarouselContainer,
  CarouselSlot,
  PatternBox,
  PREV,
  NEXT,
  D,
} from "../components";

const UpArrow = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" version="1.1" style={{ width: "15px" }}>
    <g transform="translate(-35.399 -582.91)">
      <path
        style={{ fill: active ? "#EEEE00" : "#000000" }}
        d="m40.836 598.91v-6.75h-5.4375l4-4.625 4-4.625 4 4.625 4 4.625h-5.0938v6.75h-5.4688z"
      />
    </g>
  </svg>
);

const DownArrow = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" version="1.1" style={{ width: "15px" }}>
    <g transform="translate(-35.399 -598.91)">
      <path
        style={{ fill: active ? "#EEEE00" : "#000000" }}
        d="m40.836 598.91v6.75h-5.4375l4 4.625 4 4.625 4-4.625 4-4.625h-5.0938v-6.75h-5.4688z"
      />
    </g>
  </svg>
);

type Direction = typeof PREV | typeof NEXT;

interface CarouselState {
  pos: number;
  sliding: boolean;
  dir: Direction;
}

type CarouselAction =
  | { type: Direction; numItems: number }
  | { type: "stopSliding" };

const getOrder = (index: number, pos: number, numItems: number) => {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

const pattern = [UP, DOWN, UP, DOWN];

const getInitialState = (numItems: number): CarouselState => ({
  pos: numItems - 1,
  sliding: false,
  dir: NEXT,
});

const Carousel: FunctionComponent<{ children: ReactNode }> = (props) => {
  const numItems = React.Children.count(props.children);
  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState(numItems)
  );

  const slide = (dir: Direction) => {
    dispatch({ type: dir, numItems });
    setTimeout(() => {
      dispatch({ type: "stopSliding" });
    }, 50);
  };

  const [pIdx, setPIdx] = React.useState(0);

  const handleSwiped = (eventData: SwipeEventData) => {
    if (eventData.dir === pattern[pIdx]) {
      // user successfully got to the end of the pattern!
      if (pIdx + 1 === pattern.length) {
        setPIdx(pattern.length);
        slide(NEXT);
        setTimeout(() => {
          setPIdx(0);
        }, 50);
      } else {
        // user is cont. with the pattern
        setPIdx((i) => (i += 1));
      }
    } else {
      // user got the next pattern step wrong, reset pattern
      setPIdx(0);
    }
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
      <PatternBox {...handlers}>
        Within this text area container, swipe the pattern seen below to make
        the carousel navigate to the next slide.
        {`\n`}
        <p style={{ textAlign: "center", paddingTop: "15px" }}>
          Swipe:
          <D>
            <UpArrow active={pIdx > 0} />
          </D>
          <D>
            <DownArrow active={pIdx > 1} />
          </D>
          <D>
            <UpArrow active={pIdx > 2} />
          </D>
          <D>
            <DownArrow active={pIdx > 3} />
          </D>
        </p>
      </PatternBox>
      <div style={{ paddingBottom: "15px" }}>
        <Wrapper>
          <CarouselContainer dir={state.dir} sliding={state.sliding}>
            {React.Children.map(props.children, (child, index) => (
              <CarouselSlot
                key={index}
                order={getOrder(index, state.pos, numItems)}
              >
                {child}
              </CarouselSlot>
            ))}
          </CarouselContainer>
        </Wrapper>
      </div>
    </>
  );
};

function reducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case "stopSliding":
      return { ...state, sliding: false };
    default:
      return state;
  }
}

export default Carousel;
