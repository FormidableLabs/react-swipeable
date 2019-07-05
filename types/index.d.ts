// TypeScript Version: 3.0

import * as React from 'react'

export type Vector2 = [number, number]
export interface EventData {
  event: MouseEvent | TouchEvent
  deltaX: number
  deltaY: number
  absX: number
  absY: number
  initial: Vector2
  velocity: number
  dir: 'Left' | 'Right' | 'Up' | 'Down'
}

export type SwipeCallback = (eventData: EventData) => void

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
  innerRef?: (element: HTMLElement | null) => void
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export interface SwipeableHandlers {
  ref: (element: HTMLElement | null) => void
  onMouseDown?: React.MouseEventHandler
}

export function useSwipeable(options: SwipeableOptions): SwipeableHandlers

export class Swipeable extends React.PureComponent<SwipeableProps & SwipeableOptions> {}
