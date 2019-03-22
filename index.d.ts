import * as React from 'react'

declare class ReactSwipeable<T extends Element = HTMLElement> extends React.Component<
  ReactSwipeable.SwipeableProps<T>
> {}

interface EventData {
  event: React.TouchEvent<T>;
  deltaX: number;
  deltaY: number;
  absX: number;
  absY: number;
  velocity: number;
  dir: string;
}

declare namespace ReactSwipeable {
  type OnSwipingCallback<T extends Element = HTMLElement> = ({}: EventData) => void
  type OnSwipedCallback<T extends Element = HTMLElement> = ({}: EventData) => void
  type OnSwipedDirectionCallback<T extends Element = HTMLElement> = (
    event: React.TouchEvent<T>,
    delta: number,
    isFlick: boolean,
  ) => void

  interface SwipeableProps<T extends Element = HTMLElement>
    extends React.ClassAttributes<ReactSwipeable<T>>,
      React.HTMLAttributes<T> {
    // Event data
    onSwiped?: OnSwipedCallback<T>
    onSwipedLeft?: OnSwipedDirectionCallback<T>
    onSwipedRight?: OnSwipedDirectionCallback<T>
    onSwipedUp?: OnSwipedDirectionCallback<T>
    onSwipedDown?: OnSwipedDirectionCallback<T>
    onSwiping?: OnSwipingCallback<T>

    // Configuration Props
    delta?: number
    preventDefaultTouchmoveEvent?: boolean
    trackTouch?: boolean
    trackMouse?: boolean
    rotationAngle?: number

    // Component Specific Props
    nodeName?: string
    innerRef?: React.Ref<T>
    children?: React.ReactNode
  }
}

export = ReactSwipeable
