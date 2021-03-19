import React, { FunctionComponent } from 'react';
import { useSwipeable, UP, DOWN, SwipeEventData } from '../../../src';
import {
  Wrapper,
  CarouselContainer,
  CarouselSlot,
  PatternBox,
  PREV,
  NEXT,
  D
} from './components';

type Direction = typeof PREV | typeof NEXT;

interface CarouselState {
  pos: number;
  sliding: boolean;
  dir: Direction;
}

type CarouselAction =
  | { type: Direction, numItems: number }
  | { type: 'stopSliding' | 'reset' };

const getOrder = (index: number, pos: number, numItems: number) => {
  return index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos;
};

const pattern = [UP, DOWN, UP, DOWN];

const initialState: CarouselState = { pos: 0, sliding: false, dir: NEXT };

const Carousel: FunctionComponent = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const numItems = React.Children.count(props.children);

  const slide = (dir: Direction) => {
    dispatch({ type: dir, numItems });
    setTimeout(() => {
      dispatch({ type: 'stopSliding' });
    }, 50);
  };

  const [pIdx, setPIdx] = React.useState(0);

  const handleSwiped = (eventData: SwipeEventData) => {
    if (eventData.dir === pattern[pIdx]) {
      // user successfully got to the end of the pattern!
      if (pIdx + 1 === pattern.length) {
        setPIdx(0);
        slide(NEXT);
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
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <>
      <PatternBox {...handlers}>
        Swipe Directions:{`\n`}
        <D active={pIdx > 0}>⬆</D>
        <D active={pIdx > 1}>⬇</D>
        <D active={pIdx > 2}>⬆</D>
        <D active={pIdx > 3}>⬇</D>
        {`\n`}
        {`\n`}
        Swipe this pattern within this box to make the carousel go to the next
        slide
      </PatternBox>
      <div>
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
    case 'reset':
      return initialState;
    case PREV:
      return {
        ...state,
        dir: PREV,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1
      };
    case NEXT:
      return {
        ...state,
        dir: NEXT,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1
      };
    case 'stopSliding':
      return { ...state, sliding: false };
    default:
      return state;
  }
}

export default Carousel;
