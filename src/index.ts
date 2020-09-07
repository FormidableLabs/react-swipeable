/* global document */
import * as React from "react";

export type HandledEvents = React.MouseEvent | TouchEvent | MouseEvent;
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
export type TapCallback = ({ event }: { event: HandledEvents }) => void;

export interface SwipeableOptions {
  // Event handler/callbacks
  onSwiped?: SwipeCallback;
  onSwipedLeft?: SwipeCallback;
  onSwipedRight?: SwipeCallback;
  onSwipedUp?: SwipeCallback;
  onSwipedDown?: SwipeCallback;
  onSwiping?: SwipeCallback;
  onTap?: TapCallback;

  // Configuration Props
  delta?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackTouch?: boolean;
  trackMouse?: boolean;
  rotationAngle?: number;
}

export interface SwipeableHandlers {
  ref(element: HTMLElement | null): void;
  onMouseDown?(event: React.MouseEvent): void;
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
  start: number;
  first?: boolean;
  cleanUpTouch?(): void;
  el?: HTMLElement;
};

type Props = {
  // Event handler/callbacks
  onSwiped?: SwipeCallback;
  onSwipedLeft?: SwipeCallback;
  onSwipedRight?: SwipeCallback;
  onSwipedUp?: SwipeCallback;
  onSwipedDown?: SwipeCallback;
  onSwiping?: SwipeCallback;
  onTap?: TapCallback;

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
  start: 0,
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
      return RIGHT;
    }
    return LEFT;
  } else if (deltaY > 0) {
    return DOWN;
  }
  return UP;
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

type Setter = (state: State, props: Props) => State;
type Set = (setter: Setter) => void;
function getHandlers(
  set: Set,
  handlerProps: { trackMouse: boolean | undefined }
): [
  {
    ref: (element: HTMLElement | null) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
  },
  (el: any) => (() => void) | undefined
] {
  const onStart = (event: HandledEvents) => {
    // if more than a single touch don't track, for now...
    if (event && "touches" in event && event.touches.length > 1) return;

    set((state, props) => {
      // setup mouse listeners on document to track swipe since swipe can leave container
      if (props.trackMouse) {
        document.addEventListener(mouseMove, onMove);
        document.addEventListener(mouseUp, onUp);
      }
      const { clientX, clientY } =
        "touches" in event ? event.touches[0] : event;
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
      // Discount a swipe if additional touches are present after
      // a swipe has started.
      if ("touches" in event && event.touches.length > 1) {
        return state;
      }
      const { clientX, clientY } =
        "touches" in event ? event.touches[0] : event;
      const [x, y] = rotateXYByAngle([clientX, clientY], props.rotationAngle);
      const deltaX = x - state.xy[0];
      const deltaY = y - state.xy[1];
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const time = (event.timeStamp || 0) - state.start;
      const velocity = Math.sqrt(absX * absX + absY * absY) / (time || 1);

      // if swipe is under delta and we have not started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping)
        return state;

      const dir = getDirection(absX, absY, deltaX, deltaY);
      const eventData: EventData = {
        ...state.eventData,
        event,
        absX,
        absY,
        deltaX,
        deltaY,
        velocity,
        dir,
      } as EventData;

      props.onSwiping && props.onSwiping(eventData);

      // track if a swipe is cancelable(handler for swiping or swiped(dir) exists)
      // so we can call preventDefault if needed
      let cancelablePageSwipe = false;
      if (props.onSwiping || props.onSwiped || `onSwiped${dir}` in props) {
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
      let eventData: EventData | undefined;
      if (state.swiping) {
        eventData = { ...state.eventData, event } as EventData;
        props.onSwiped && props.onSwiped(eventData);

        const onSwipedDir = `onSwiped${eventData.dir}`;
        if (onSwipedDir in props) {
          (props as any)[onSwipedDir](eventData);
        }
      } else {
        props.onTap && props.onTap({ event });
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

  const attachTouch = (el: HTMLElement) => {
    if (el && el.addEventListener) {
      // attach touch event listeners and handlers
      const tls: [
        typeof touchStart | typeof touchMove | typeof touchEnd,
        (e: HandledEvents) => void
      ][] = [
        [touchStart, onStart],
        [touchMove, onMove],
        [touchEnd, onEnd],
      ];
      tls.forEach(([e, h]) => el.addEventListener(e, h));
      // return properly scoped cleanup method for removing listeners
      return () => tls.forEach(([e, h]) => el.removeEventListener(e, h));
    }
  };

  const onRef = (el: HTMLElement | null) => {
    // "inline" ref functions are called twice on render, once with null then again with DOM element
    // ignore null here
    if (el === null) return;
    set((state, props) => {
      // if the same DOM el as previous just return state
      if (state.el === el) return state;

      const addState: { cleanUpTouch?: (() => void) | null } = {};
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
      return { ...state, el, ...addState } as State;
    });
  };

  // set ref callback to attach touch event listeners
  const output: { ref: typeof onRef; onMouseDown?: typeof onStart } = {
    ref: onRef,
  };

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
  const addState: { cleanUpTouch?(): void } = {};
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
