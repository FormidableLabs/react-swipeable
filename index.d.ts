declare module 'react-swipeable' {
  import * as React from 'react'

  namespace ReactSwipeable {
    interface Event {
      event: React.TouchEvent
      deltaX: number
      deltaY: number
      absX: number
      absY: number
      velocity: number
      dir: 'Left' | 'Right' | 'Up' | 'Down'
    }

    type Callback = ({}: Event) => void

    interface SwipeableProps<T extends Element = HTMLElement> extends React.ClassAttributes<Swipeable>, React.HTMLAttributes<T> {
      // Event data
      onSwiped?: Callback
      onSwipedLeft?: Callback
      onSwipedRight?: Callback
      onSwipedUp?: Callback
      onSwipedDown?: Callback
      onSwiping?: Callback

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
      style?: any
      className?: string
    }
  }

  export class Swipeable extends React.Component<ReactSwipeable.SwipeableProps> {}
}
