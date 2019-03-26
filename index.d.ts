declare module 'react-swipeable' {
  import * as React from 'react'

  namespace ReactSwipeable {
    interface Event<T> {
      event: React.TouchEvent<T>
      deltaX: number
      deltaY: number
      absX: number
      absY: number
      velocity: number
      dir: 'Left' | 'Right' | 'Up' | 'Down'
    }

    type Callback<T extends Element = HTMLElement> = ({}: Event<T>) => void

    interface SwipeableProps<T extends Element = HTMLElement> extends React.ClassAttributes<Swipeable<T>>, React.HTMLAttributes<T> {
      // Event data
      onSwiped?: Callback<T>
      onSwipedLeft?: Callback<T>
      onSwipedRight?: Callback<T>
      onSwipedUp?: Callback<T>
      onSwipedDown?: Callback<T>
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
      children?: React.ReactNode | React.ReactNode[]
      style?: any
      className?: string
    }
  }

  export class Swipeable<T extends Element = HTMLElement> extends React.Component<ReactSwipeable.SwipeableProps<T>> {}
}
