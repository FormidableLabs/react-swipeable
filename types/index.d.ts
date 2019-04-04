// TypeScript Version: 3.4

import * as React from 'react'

export interface EventData {
  event: MouseEvent | TouchEvent
  deltaX: number
  deltaY: number
  absX: number
  absY: number
  velocity: number
  dir: 'Left' | 'Right' | 'Up' | 'Down'
}

export type SwipeCallback = ({}: EventData) => void

export interface SwipeableOptions {
  // Event handler/callbacks
  onSwiped?: SwipeCallback
  onSwipedLeft?: SwipeCallback
  onSwipedRight?: SwipeCallback
  onSwipedUp?: SwipeCallback
  onSwipedDown?: SwipeCallback
  onSwiping?: SwipeCallback

  // Configuration Props
  delta?: number
  preventDefaultTouchmoveEvent?: boolean
  trackTouch?: boolean
  trackMouse?: boolean
  rotationAngle?: number
}

// Component Specific Props
export interface SwipeableProps {
  nodeName?: string
  innerRef?: ({}: HTMLElement) => void
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export class Swipeable extends React.PureComponent<SwipeableProps & SwipeableOptions> {}
