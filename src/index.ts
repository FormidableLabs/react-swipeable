/* global document */
import * as React from "react";

export type HandledEvents = React.MouseEvent | React.TouchEvent;
export type Vector2 = [number, number];
export type EventData = {
  event: HandledEvents;
  deltaX: number;
  deltaY: number;
  absX: number;
  absY: number;
  first: boolean;
  initial: Vector2;
  velocity: number;
  dir: "Left" | "Right" | "Up" | "Down";
};

export type SwipeCallback = (eventData: EventData) => void;

export interface SwipeableOptions {
  // Event handler/callbacks
  onSwiped?: SwipeCallback;
  onSwipedLeft?: SwipeCallback;
  onSwipedRight?: SwipeCallback;
  onSwipedUp?: SwipeCallback;
  onSwipedDown?: SwipeCallback;
  onSwiping?: SwipeCallback;

  // Configuration Props
  delta?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackTouch?: boolean;
  trackMouse?: boolean;
  rotationAngle?: number;
}

export interface SwipeableHandlers {
  ref: (element: HTMLElement | null) => void;
  onMouseDown?: React.MouseEventHandler;
}

type StateEventData = {
  event?: HandledEvents;
  deltaX?: number;
  deltaY?: number;
  absX?: number;
  absY?: number;
  first: boolean;
  initial: Vector2;
  velocity?: number;
  dir?: "Left" | "Right" | "Up" | "Down";
};

type State = {
  xy: Vector2;
  swiping: boolean;
  eventData?: StateEventData;
  start?: number;
  first?: boolean;
  cleanUpTouch?(): void;
  el?: React.DOMElement;
};

type Props = {
  // Event handler/callbacks
  onSwiped?: SwipeCallback;
  onSwipedLeft?: SwipeCallback;
  onSwipedRight?: SwipeCallback;
  onSwipedUp?: SwipeCallback;
  onSwipedDown?: SwipeCallback;
  onSwiping?: SwipeCallback;

  // Configuration Props
  delta: number;
  preventDefaultTouchmoveEvent: boolean;
  trackTouch: boolean;
  trackMouse: boolean;
  rotationAngle: number;
};

const defaultProps = {
  preventDefaultTouchmoveEvent: false,
  delta: 10,
  rotationAngle: 0,
  trackMouse: false,
  trackTouch: true,
};

const initialState: State = {
  xy: [0, 0],
  swiping: false,
  eventData: undefined,
  start: undefined,
};
export const LEFT = "Left";
export const RIGHT = "Right";
export const UP = "Up";
export const DOWN = "Down";
const touchStart = "touchstart";
const touchMove = "touchmove";
const touchEnd = "touchend";
const mouseMove = "mousemove";
const mouseUp = "mouseup";

function getDirection(
  absX: number,
  absY: number,
  deltaX: number,
  deltaY: number
) {
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

function rotateXYByAngle(pos: Vector2, angle: number): Vector2 {
  if (angle === 0) return pos;
  const angleInRadians = (Math.PI / 180) * angle;
  const x =
    pos[0] * Math.cos(angleInRadians) + pos[1] * Math.sin(angleInRadians);
  const y =
    pos[1] * Math.cos(angleInRadians) - pos[0] * Math.sin(angleInRadians);
  return [x, y];
}

type Setter = (state: State, props: SwipeableOptions) => State;
type Set = (setter: Setter) => void;
function getHandlers(
  set: Set,
  handlerProps: { trackMouse: boolean | undefined }
): [
  {
    ref: (element: HTMLElement | null) => void;
    onMouseDown?: (event: HandledEvents) => void;
  },
  (el: any) => (() => void) | undefined
] {
  const onStart = (event: HandledEvents) => {
    // if more than a single touch don't track, for now...
    if (event && event.touches && event.touches.length > 1) return;

    set((state: State, props: SwipeableOptions) => {
      // setup mouse listeners on document to track swipe since swipe can leave container
      if (props.trackMouse) {
        document.addEventListener(mouseMove, onMove);
        document.addEventListener(mouseUp, onUp);
      }
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      const xy = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      return {
        ...state,
        ...initialState,
        eventData: { initial: [...xy], first: true },
        xy,
        start: event.timeStamp || 0,
      };
    });
  };

  const onMove = (event: HandledEvents) => {
    set((state, props) => {
      if (
        !state.xy[0] ||
        !state.xy[1] ||
        (event.touches && event.touches.length > 1)
      ) {
        return state;
      }
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      const [x, y] = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      const deltaX = state.xy[0] - x;
      const deltaY = state.xy[1] - y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const time = (event.timeStamp || 0) - state.start;
      const velocity = Math.sqrt(absX * absX + absY * absY) / (time || 1);

      // if swipe is under delta and we have not started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping)
        return state;

      const dir = getDirection(absX, absY, deltaX, deltaY);
      const eventData = {
        ...state.eventData,
        event,
        absX,
        absY,
        deltaX,
        deltaY,
        velocity,
        dir,
      };

      props.onSwiping && props.onSwiping(eventData);

      // track if a swipe is cancelable(handler for swiping or swiped(dir) exists)
      // so we can call preventDefault if needed
      let cancelablePageSwipe = false;
      if (props.onSwiping || props.onSwiped || props[`onSwiped${dir}`]) {
        cancelablePageSwipe = true;
      }

      if (
        cancelablePageSwipe &&
        props.preventDefaultTouchmoveEvent &&
        props.trackTouch &&
        event.cancelable
      )
        event.preventDefault();

      // first is now always false
      return {
        ...state,
        eventData: { ...eventData, first: false },
        swiping: true,
      };
    });
  };

  const onEnd = (event: HandledEvents) => {
    set((state, props) => {
      let eventData;
      if (state.swiping) {
        eventData = { ...state.eventData, event };

        props.onSwiped && props.onSwiped(eventData);

        props[`onSwiped${eventData.dir}`] &&
          props[`onSwiped${eventData.dir}`](eventData);
      }
      return { ...state, ...initialState, eventData };
    });
  };

  const cleanUpMouse = () => {
    // safe to just call removeEventListener
    document.removeEventListener(mouseMove, onMove);
    document.removeEventListener(mouseUp, onUp);
  };

  const onUp = (e: HandledEvents) => {
    cleanUpMouse();
    onEnd(e);
  };

  const attachTouch = (el: React.DOMElement) => {
    if (el && el.addEventListener) {
      // attach touch event listeners and handlers
      const tls = [
        [touchStart, onStart],
        [touchMove, onMove],
        [touchEnd, onEnd],
      ];
      tls.forEach(([e, h]) => el.addEventListener(e, h));
      // return properly scoped cleanup method for removing listeners
      return () => tls.forEach(([e, h]) => el.removeEventListener(e, h));
    }
  };

  const onRef = (el: React.DOMElement) => {
    // "inline" ref functions are called twice on render, once with null then again with DOM element
    // ignore null here
    if (el === null) return;
    set((state, props) => {
      // if the same DOM el as previous just return state
      if (state.el === el) return state;

      let addState = {};
      // if new DOM el clean up old DOM and reset cleanUpTouch
      if (state.el && state.el !== el && state.cleanUpTouch) {
        state.cleanUpTouch();
        addState.cleanUpTouch = null;
      }
      // only attach if we want to track touch
      if (props.trackTouch && el) {
        addState.cleanUpTouch = attachTouch(el);
      }

      // store event attached DOM el for comparison, clean up, and re-attachment
      return { ...state, el, ...addState };
    });
  };

  // set ref callback to attach touch event listeners
  const output = { ref: onRef };

  // if track mouse attach mouse down listener
  if (handlerProps.trackMouse) {
    output.onMouseDown = onStart;
  }

  return [output, attachTouch];
}

function updateTransientState(
  state: State,
  props: Props,
  attachTouch: (el: any) => (() => void) | undefined
) {
  let addState: { cleanUpTouch?(): void } = {};
  // clean up touch handlers if no longer tracking touches
  if (!props.trackTouch && state.cleanUpTouch) {
    state.cleanUpTouch();
    addState.cleanUpTouch = undefined;
  } else if (props.trackTouch && !state.cleanUpTouch) {
    // attach/re-attach touch handlers
    if (state.el) {
      addState.cleanUpTouch = attachTouch(state.el);
    }
  }
  return { ...state, ...addState };
}

export function useSwipeable(options: SwipeableOptions): SwipeableHandlers {
  const { trackMouse } = options;
  const transientState = React.useRef({ ...initialState });
  const transientProps = React.useRef<Props>({ ...defaultProps });
  transientProps.current = { ...defaultProps, ...options };

  const [handlers, attachTouch] = React.useMemo(
    () =>
      getHandlers(
        (cb) =>
          (transientState.current = cb(
            transientState.current,
            transientProps.current
          )),
        { trackMouse }
      ),
    [trackMouse]
  );

  transientState.current = updateTransientState(
    transientState.current,
    transientProps.current,
    attachTouch
  );

  return handlers;
}
