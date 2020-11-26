/* global document */
import * as React from "react";
import {
  AttachTouch,
  SwipeDirections,
  DOWN,
  SwipeEventData,
  HandledEvents,
  LEFT,
  RIGHT,
  Setter,
  SwipeableHandlers,
  SwipeableProps,
  SwipeablePropsWithDefaultOptions,
  SwipeableState,
  SwipeCallback,
  TapCallback,
  UP,
  Vector2,
} from "./types";

export {
  LEFT,
  RIGHT,
  UP,
  DOWN,
  SwipeDirections,
  SwipeEventData,
  SwipeCallback,
  TapCallback,
  SwipeableHandlers,
  SwipeableProps,
  Vector2,
};

const defaultProps = {
  delta: 10,
  preventDefaultTouchmoveEvent: false,
  rotationAngle: 0,
  trackMouse: false,
  trackTouch: true,
};
const initialState: SwipeableState = {
  first: true,
  initial: [0, 0],
  start: 0,
  swiping: false,
  xy: [0, 0],
};
const mouseMove = "mousemove";
const mouseUp = "mouseup";
const touchEnd = "touchend";
const touchMove = "touchmove";
const touchStart = "touchstart";

function getDirection(
  absX: number,
  absY: number,
  deltaX: number,
  deltaY: number
): SwipeDirections {
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

function getHandlers(
  set: Setter,
  handlerProps: { trackMouse: boolean | undefined }
): [
  {
    ref: (element: HTMLElement | null) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
  },
  AttachTouch
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
        initial: [...xy],
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
      const vxvy: Vector2 = [deltaX / (time || 1), deltaY / (time || 1)];

      // if swipe is under delta and we have not started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping)
        return state;

      const dir = getDirection(absX, absY, deltaX, deltaY);
      const eventData = {
        absX,
        absY,
        deltaX,
        deltaY,
        dir,
        event,
        first: state.first,
        initial: state.initial,
        velocity,
        vxvy,
      };

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

      return {
        ...state,
        // first is now always false
        first: false,
        eventData,
        swiping: true,
      };
    });
  };

  const onEnd = (event: HandledEvents) => {
    set((state, props) => {
      let eventData: SwipeEventData | undefined;
      if (state.swiping && state.eventData) {
        eventData = { ...state.eventData, event };
        props.onSwiped && props.onSwiped(eventData);

        const onSwipedDir = `onSwiped${eventData.dir}`;
        if (onSwipedDir in props) {
          ((props as any)[onSwipedDir] as SwipeCallback)(eventData);
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

  /**
   * Switch of "passive" property for now.
   * When `preventDefaultTouchmoveEvent` is:
   * - true => { passive: false }
   * - false => { passive: true }
   *
   * Could take entire `addEventListener` options object as a param later?
   */
  const attachTouch: AttachTouch = (el, passive) => {
    let cleanup = () => {};
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
      tls.forEach(([e, h]) => el.addEventListener(e, h, { passive }));
      // return properly scoped cleanup method for removing listeners, options not required
      cleanup = () => tls.forEach(([e, h]) => el.removeEventListener(e, h));
    }
    return cleanup;
  };

  const onRef = (el: HTMLElement | null) => {
    // "inline" ref functions are called twice on render, once with null then again with DOM element
    // ignore null here
    if (el === null) return;
    set((state, props) => {
      // if the same DOM el as previous just return state
      if (state.el === el) return state;

      const addState: { cleanUpTouch?: () => void } = {};
      // if new DOM el clean up old DOM and reset cleanUpTouch
      if (state.el && state.el !== el && state.cleanUpTouch) {
        state.cleanUpTouch();
        addState.cleanUpTouch = undefined;
      }
      // only attach if we want to track touch
      if (props.trackTouch && el) {
        addState.cleanUpTouch = attachTouch(
          el,
          !props.preventDefaultTouchmoveEvent
        );
      }

      // store event attached DOM el for comparison, clean up, and re-attachment
      return { ...state, el, ...addState };
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
  state: SwipeableState,
  props: SwipeableProps,
  attachTouch: AttachTouch
) {
  const addState: { cleanUpTouch?(): void } = {};
  // clean up touch handlers if no longer tracking touches
  if (!props.trackTouch && state.cleanUpTouch) {
    state.cleanUpTouch();
    addState.cleanUpTouch = undefined;
  } else if (props.trackTouch && !state.cleanUpTouch) {
    // attach/re-attach touch handlers
    if (state.el) {
      addState.cleanUpTouch = attachTouch(
        state.el,
        !props.preventDefaultTouchmoveEvent
      );
    }
  }
  return { ...state, ...addState };
}

export function useSwipeable(options: SwipeableProps): SwipeableHandlers {
  const { trackMouse } = options;
  const transientState = React.useRef({ ...initialState });
  const transientProps = React.useRef<SwipeablePropsWithDefaultOptions>({
    ...defaultProps,
  });
  transientProps.current = { ...defaultProps, ...options };

  const [handlers, attachTouch] = React.useMemo(
    () =>
      getHandlers(
        (stateSetter) =>
          (transientState.current = stateSetter(
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
