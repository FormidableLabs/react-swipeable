import * as React from 'react'

declare class ReactSwipeable<T extends Element = HTMLElement> extends React.Component<
  ReactSwipeable.SwipeableProps<T>
> {}

interface EventData<T> {
  event: React.TouchEvent<T>;
  deltaX: number;
  deltaY: number;
  absX: number;
  absY: number;
  velocity: number;
  dir: 'Left' | 'Right' | 'Up' | 'Down';
}

declare namespace ReactSwipeable {
  type Calback<T extends Element = HTMLElement> = ({}: EventData<T>) => void
  type DirectionCallback<T extends Element = HTMLElement> = ({}: EventData<T>) => void

  interface SwipeableProps<T extends Element = HTMLElement>
    extends React.ClassAttributes<ReactSwipeable<T>>,
      React.HTMLAttributes<T> {
    // Event data
    onSwiped?: Callback<T>
    onSwipedLeft?: DirectionCallback<T>
    onSwipedRight?: DirectionCallback<T>
    onSwipedUp?: DirectionCallback<T>
    onSwipedDown?: DirectionCallback<T>
    onSwiping?: Callback<T>

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
