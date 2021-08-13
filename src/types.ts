import * as React from "react";

export const LEFT = "Left";
export const RIGHT = "Right";
export const UP = "Up";
export const DOWN = "Down";
export type HandledEvents = React.MouseEvent | TouchEvent | MouseEvent;
export type Vector2 = [number, number];
export type SwipeDirections =
  | typeof LEFT
  | typeof RIGHT
  | typeof UP
  | typeof DOWN;
export interface SwipeEventData {
  absX: number;
  absY: number;
  deltaX: number;
  deltaY: number;
  dir: SwipeDirections;
  event: HandledEvents;
  first: boolean;
  initial: Vector2;
  velocity: number;
  vxvy: Vector2;
}

export type SwipeCallback = (eventData: SwipeEventData) => void;
export type TapCallback = ({ event }: { event: HandledEvents }) => void;

export type SwipeableCallbacks = {
  // Event handler/callbacks
  onSwipeStart: SwipeCallback;
  onSwiped: SwipeCallback;
  onSwipedDown: SwipeCallback;
  onSwipedLeft: SwipeCallback;
  onSwipedRight: SwipeCallback;
  onSwipedUp: SwipeCallback;
  onSwiping: SwipeCallback;
  onTap: TapCallback;
};

// Configuration Options
export type ConfigurationOptionDelta =
  | number
  | { [key in Lowercase<SwipeDirections>]?: number };
export interface ConfigurationOptions {
  delta: ConfigurationOptionDelta;
  preventDefaultTouchmoveEvent: boolean;
  rotationAngle: number;
  trackMouse: boolean;
  trackTouch: boolean;
}

export type SwipeableProps = Partial<SwipeableCallbacks & ConfigurationOptions>;

export type SwipeablePropsWithDefaultOptions = Partial<SwipeableCallbacks> &
  ConfigurationOptions;

export interface SwipeableHandlers {
  ref(element: HTMLElement | null): void;
  onMouseDown?(event: React.MouseEvent): void;
}

export type SwipeableState = {
  cleanUpTouch?: () => void;
  el?: HTMLElement;
  eventData?: SwipeEventData;
  first: boolean;
  initial: Vector2;
  start: number;
  swiping: boolean;
  xy: Vector2;
};

export type StateSetter = (
  state: SwipeableState,
  props: SwipeablePropsWithDefaultOptions
) => SwipeableState;
export type Setter = (stateSetter: StateSetter) => void;
export type AttachTouch = (el: HTMLElement, passive: boolean) => () => void;
