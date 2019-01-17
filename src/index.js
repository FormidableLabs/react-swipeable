/* global document */
import React from 'react';

const defaultProps = {
  eventListenerOptions: { passive: false },
  preventDefaultTouchmoveEvent: true,
  flickThreshold: 0.6,
  delta: 10,
  stopPropagation: false,
  disabled: false,
  rotationAngle: 0,
  trackMouse: false,
  trackTouch: true,
};
const initialState = {
  xy: [0, 0],
  swiping: false,
  start: undefined,
};
const LEFT = 'Left';
const RIGHT = 'Right';
const UP = 'Up';
const DOWN = 'Down';
const touchMove = 'touchmove';
const touchEnd = 'touchend';
const mouseMove = 'mousemove';
const mouseUp = 'mouseup';

function getDirection({ absX, absY, deltaX, deltaY }) {
  if (absX > absY) {
    if (deltaX > 0) {
      return LEFT;
    }
    return RIGHT;
  } else if (deltaY > 0) {
    return UP;
  }
  return DOWN;
}

function rotateXYByAngle(pos, angle) {
  if (angle === 0) return pos;
  const angleInRadians = (Math.PI / 180) * angle;
  const x = pos.x * Math.cos(angleInRadians) + pos.y * Math.sin(angleInRadians);
  const y = pos.y * Math.cos(angleInRadians) - pos.x * Math.sin(angleInRadians);
  return [x, y];
}

function getHandlers(set, props) {
  const onStart = (event) => {
    // if more than a single touch don't track, for now...
    if (event.touches && event.touches.length > 1) return;

    set(() => {
      const { clientX: x, clientY: y } = event.touches ? event.touches[0] : event;
      const xy = rotateXYByAngle([x, y], props.rotationAngle);
      return {
        ...initialState,
        xy,
        start: Date.now(),
      };
    });
  };

  const onMove = (event) => {
    console.log('moved1----');
    set((state) => {
      console.log('moved1a----', state);
      if (!state.xy[0] || !state.xy[1] || event.touches && event.touches.length > 1) {
        return state;
      }
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      const [x, y] = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      const deltaX = state.xy[0] - x;
      const deltaY = state.xy[1] - y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const time = Date.now() - state.start;
      const velocity = Math.sqrt(absX * absX + absY * absY) / time;

      // if swipe is under delta and we have not already started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping) return state;

      if (props.stopPropagation) event.stopPropagation();

      const newState = { event, deltaX, deltaY, absX, absY, velocity };

      console.log('moved2----', newState);

      props.onSwiping && props.onSwiping(newState);

      // track if a swipe is cancelable
      // so we can call prevenDefault if needed
      let cancelablePageSwipe = false;
      if (props.onSwiping || props.onSwiped) {
        cancelablePageSwipe = true;
      }

      const dir = getDirection(newState);

      if (props[`onSwiping${dir}`] || props[`onSwiped${dir}`]) {
        props[`onSwiping${dir}`] && props[`onSwiping${dir}`](newState);
        cancelablePageSwipe = true;
      }

      if (cancelablePageSwipe && props.preventDefaultTouchmoveEvent) event.preventDefault();

      return { ...state, ...newState, swiping: true };
    });
  };

  const onEnd = (event) => {
    set((state) => {
      if (state.swiping) {
        if (props.stopPropagation) event.stopPropagation();

        const isFlick = state.velocity > props.flickThreshold;

        const newState = { ...state, event, isFlick };

        props.onSwiped && props.onSwiped(newState);

        const dir = getDirection(newState);

        props[`onSwiped${dir}`] && props[`onSwiped${dir}`](newState);
      } else {
        props.onTap && props.onTap({ ...state, event });
      }
      return { ...initialState };
    });
  };

  const onDown = (e) => {
    if (props.trackMouse) {
      console.log('onDown---');
      document.addEventListener(mouseMove, onMove);
      document.addEventListener(mouseUp, onUp);
    }
    if (props.trackTouch) {
      document.addEventListener(touchMove, onMove, props.eventListenerOptions);
      document.addEventListener(touchEnd, onUp, props.eventListenerOptions);
    }
    onStart(e);
  };

  const stop = () => {
    if (props.trackMouse) {
      document.removeEventListener(mouseMove, onMove);
      document.removeEventListener(mouseUp, onUp);
    }
    if (props.trackTouch) {
      document.removeEventListener(touchMove, onMove, props.eventListenerOptions);
      document.removeEventListener(touchEnd, onUp, props.eventListenerOptions);
    }
  };

  const onUp = (e) => {
    stop();
    onEnd(e);
  };

  const output = {};
  if (props.trackMouse) {
    output.onMouseDown = onDown;
  }
  if (props.trackTouch) {
    output.onTouchStart = onDown;
  }

  return output;
}

export default function useSwipeable(props) {
  const transientState = React.useRef(initialState);
  const [spread] = React.useState(() => () =>
    getHandlers(cb => (transientState.current = cb(transientState.current)), { ...defaultProps, ...props }),
  );
  return spread;
}
