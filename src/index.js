/* global document */
import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  preventDefaultTouchmoveEvent: false,
  delta: 10,
  rotationAngle: 0,
  trackMouse: false,
  trackTouch: true
}
const initialState = {
  xy: [0, 0],
  swiping: false,
  lastEventData: undefined,
  start: undefined
}
export const LEFT = 'Left'
export const RIGHT = 'Right'
export const UP = 'Up'
export const DOWN = 'Down'
const touchStart = 'touchstart'
const touchMove = 'touchmove'
const touchEnd = 'touchend'
const mouseMove = 'mousemove'
const mouseUp = 'mouseup'

function getDirection(absX, absY, deltaX, deltaY) {
  if (absX > absY) {
    if (deltaX > 0) {
      return LEFT
    }
    return RIGHT
  } else if (deltaY > 0) {
    return UP
  }
  return DOWN
}

function rotateXYByAngle(pos, angle) {
  if (angle === 0) return pos
  const angleInRadians = (Math.PI / 180) * angle
  const x = pos[0] * Math.cos(angleInRadians) + pos[1] * Math.sin(angleInRadians)
  const y = pos[1] * Math.cos(angleInRadians) - pos[0] * Math.sin(angleInRadians)
  return [x, y]
}

function getHandlers(set, props) {
  const onStart = event => {
    // if more than a single touch don't track, for now...
    if (event.touches && event.touches.length > 1) return

    set(state => {
      // setup mouse listeners on document to track swipe since swipe can leave container
      if (state.props.trackMouse) {
        document.addEventListener(mouseMove, onMove)
        document.addEventListener(mouseUp, onUp)
      }
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      const xy = rotateXYByAngle([clientX, clientY], state.props.rotationAngle)
      return { ...state, ...initialState, xy, start: event.timeStamp || 0 }
    })
  }

  const onMove = event => {
    set(state => {
      if (!state.xy[0] || !state.xy[1] || (event.touches && event.touches.length > 1)) {
        return state
      }
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      const [x, y] = rotateXYByAngle([clientX, clientY], state.props.rotationAngle)
      const deltaX = state.xy[0] - x
      const deltaY = state.xy[1] - y
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      const time = (event.timeStamp || 0) - state.start
      const velocity = Math.sqrt(absX * absX + absY * absY) / (time || 1)

      // if swipe is under delta and we have not started to track a swipe: skip update
      if (absX < props.delta && absY < props.delta && !state.swiping) return state

      const dir = getDirection(absX, absY, deltaX, deltaY)
      const eventData = { event, absX, absY, deltaX, deltaY, velocity, dir }

      state.props.onSwiping && state.props.onSwiping(eventData)

      // track if a swipe is cancelable(handler for swiping or swiped(dir) exists)
      // so we can call preventDefault if needed
      let cancelablePageSwipe = false
      if (state.props.onSwiping || state.props.onSwiped || state.props[`onSwiped${dir}`]) {
        cancelablePageSwipe = true
      }

      if (cancelablePageSwipe && state.props.preventDefaultTouchmoveEvent && state.props.trackTouch)
        event.preventDefault()

      return { ...state, lastEventData: eventData, swiping: true }
    })
  }

  const onEnd = event => {
    set(state => {
      if (state.swiping) {
        const eventData = { ...state.lastEventData, event }

        state.props.onSwiped && state.props.onSwiped(eventData)

        state.props[`onSwiped${eventData.dir}`] &&
          state.props[`onSwiped${eventData.dir}`](eventData)
      }
      return { ...state, ...initialState }
    })
  }

  const cleanUpMouse = () => {
    // safe to just call removeEventListener
    document.removeEventListener(mouseMove, onMove)
    document.removeEventListener(mouseUp, onUp)
  }

  const onUp = e => {
    cleanUpMouse()
    onEnd(e)
  }

  const attachTouch = el => {
    if (el && el.addEventListener) {
      // attach touch event listeners and handlers
      const tls = [[touchStart, onStart], [touchMove, onMove], [touchEnd, onEnd]]
      tls.forEach(([e, h]) => el.addEventListener(e, h))
      // return properly scoped cleanup method for removing listeners
      return () => tls.forEach(([e, h]) => el.removeEventListener(e, h))
    }
  }

  const onRef = el => {
    // "inline" ref functions are called twice on render, once with null then again with DOM element
    // ignore null here
    if (el === null) return
    set(state => {
      // if the same DOM el as previous just return state
      if (state.el === el) return state

      let addState = {}
      // if new DOM el clean up old DOM and reset cleanUpTouch
      if (state.el && state.el !== el && state.cleanUpTouch) {
        state.cleanUpTouch()
        addState.cleanUpTouch = null
      }
      // only attach if we want to track touch
      if (state.props.trackTouch && el) {
        addState.cleanUpTouch = attachTouch(el)
      }

      // store event attached DOM el for comparison, clean up, and re-attachment
      return { ...state, el, ...addState }
    })
  }

  // update state, props, and handlers
  set(state => {
    let addState = {}
    // clean up touch handlers if no longer tracking touches
    if (!props.trackTouch && state.cleanUpTouch) {
      state.cleanUpTouch()
      addState.cleanUpTouch = null
    } else if (props.trackTouch && !state.cleanUpTouch) {
      // attach/re-attach touch handlers
      if (state.el) {
        addState.cleanUpTouch = attachTouch(state.el)
      }
    }
    return { ...state, props, ...addState }
  })

  // set ref callback to attach touch event listeners
  const output = { ref: onRef }

  // if track mouse attach mouse down listener
  if (props.trackMouse) {
    output.onMouseDown = onStart
  }

  return output
}

export function useSwipeable(props) {
  const transientState = React.useRef({ ...initialState, type: 'hook' })
  const [spread] = React.useState(() => currentProps =>
    getHandlers(cb => (transientState.current = cb(transientState.current)), {
      ...defaultProps,
      ...currentProps
    })
  )
  return spread(props)
}

export class Swipeable extends React.PureComponent {
  static propTypes = {
    onSwiped: PropTypes.func,
    onSwiping: PropTypes.func,
    onSwipedUp: PropTypes.func,
    onSwipedRight: PropTypes.func,
    onSwipedDown: PropTypes.func,
    onSwipedLeft: PropTypes.func,
    delta: PropTypes.number,
    preventDefaultTouchmoveEvent: PropTypes.bool,
    nodeName: PropTypes.string,
    trackMouse: PropTypes.bool,
    trackTouch: PropTypes.bool,
    innerRef: PropTypes.func,
    rotationAngle: PropTypes.number
  }

  static defaultProps = defaultProps

  constructor(props) {
    super(props)
    this._state = { ...initialState, type: 'class' }
    this._set = cb => (this._state = cb(this._state))
  }

  render() {
    const { className, style, nodeName = 'div', innerRef, children, ...rest } = this.props
    const handlers = getHandlers(this._set, rest)
    const ref = innerRef ? el => (innerRef(el), handlers.ref(el)) : handlers.ref
    return React.createElement(nodeName, { ...handlers, className, style, ref }, children)
  }
}
