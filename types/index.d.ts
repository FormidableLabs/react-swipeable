declare module 'react-swipeable' {
  import * as React from 'react'

  namespace ReactSwipeable {
    interface SwipedEvent {
      event: React.TouchEvent
      deltaX: number
      deltaY: number
      absX: number
      absY: number
      velocity: number
      dir: 'Left' | 'Right' | 'Up' | 'Down'
    }

    type SwipedCallback = ({}: SwipedEvent) => void

    interface SwipeableProps extends React.ClassAttributes<Swipeable> {
      // Event data
      onSwiped?: SwipedCallback
      onSwipedLeft?: SwipedCallback
      onSwipedRight?: SwipedCallback
      onSwipedUp?: SwipedCallback
      onSwipedDown?: SwipedCallback
      onSwiping?: SwipedCallback

      // Configuration Props
      delta?: number
      preventDefaultTouchmoveEvent?: boolean
      trackTouch?: boolean
      trackMouse?: boolean
      rotationAngle?: number

      // Component Specific Props
      nodeName?: string
      innerRef?: React.Ref<React.ClassAttributes<Swipeable>>
      children?: React.ReactNode
      style?: React.CSSProperties
      className?: string
    }
  }

  export class Swipeable extends React.Component<ReactSwipeable.SwipeableProps> {}
}
