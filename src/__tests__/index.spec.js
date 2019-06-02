/* global document, jest, expect, beforeAll, afterAll */
import React from 'react'
import Enzyme from 'enzyme'
import PropTypes from 'prop-types'
import Adapter from 'enzyme-adapter-react-16'
import { Swipeable, useSwipeable, LEFT, RIGHT, UP, DOWN } from '../index'
import { createTouchEventObject as cte, createMouseEventObject as cme } from './helpers/events'

const { mount } = Enzyme

Enzyme.configure({ adapter: new Adapter() })

const DIRECTIONS = [LEFT, RIGHT, UP, DOWN]
const USESWIPEABLE = 'useSwipeable'
const SWIPEABLE = 'Swipeable'

function getMockedSwipeFunctions() {
  return DIRECTIONS.reduce((acc, dir) => ({ ...acc, [`onSwiped${dir}`]: jest.fn() }), {
    onSwiping: jest.fn(),
    onSwiped: jest.fn()
  })
}

function expectSwipingDir(fns, dir) {
  fns.mock.calls.forEach(call => {
    expect(call[0].dir).toBe(dir)
  })
}

const expectSwipeFuncsDir = (sf, dir) =>
  Object.keys(sf).forEach(s => {
    if (s.endsWith(dir) || s === 'onSwiped') {
      expect(sf[s]).toHaveBeenCalled()
    } else if (s === 'onSwiping') {
      expectSwipingDir(sf[s], dir)
    } else {
      expect(sf[s]).not.toHaveBeenCalled()
    }
  })

function mockListenersSetup(el) {
  // track eventListener adds to trigger later
  // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
  const eventListenerMap = {}
  el.addEventListener = jest.fn((event, cb) => {
    eventListenerMap[event] = cb
  })
  el.removeEventListener = jest.fn((event, cb) => {
    if (eventListenerMap[event] === cb) delete eventListenerMap[event]
  })
  return eventListenerMap
}

/*
 * Wrapping component for the hook.
 */
function SwipeableUsingHook(props) {
  const eventHandlers = useSwipeable(props)
  const Elem = props.nodeName
  // Use innerRef prop to access the mounted div for testing.
  const ref = el => (props.innerRef && props.innerRef(el), eventHandlers.ref(el)) // eslint-disable-line
  return (
    <Elem {...eventHandlers} ref={ref}>
      {props.children}
    </Elem>
  )
}
SwipeableUsingHook.propTypes = {
  nodeName: PropTypes.string
}

SwipeableUsingHook.defaultProps = {
  nodeName: 'div'
}

function setupGetMountedComponent(TYPE, mockListeners = mockListenersSetup) {
  return props => {
    let wrapper
    let eventListenerMap
    const innerRef = el => {
      // don't re-assign eventlistener map
      if (!eventListenerMap) eventListenerMap = mockListeners(el)
    }
    if (TYPE === SWIPEABLE) {
      wrapper = mount(
        <Swipeable {...props} innerRef={innerRef}>
          <span>Touch Here</span>
        </Swipeable>
      )
    } else if (TYPE === USESWIPEABLE) {
      wrapper = mount(
        <SwipeableUsingHook {...props} innerRef={innerRef}>
          <span>Touch Here</span>
        </SwipeableUsingHook>
      )
    }
    return { eventListenerMap, wrapper }
  }
}

;[USESWIPEABLE, SWIPEABLE].forEach(TYPE => {
  describe(`${TYPE}`, () => {
    let origAddEventListener
    let origRemoveEventListener
    let eventListenerMapDocument
    const getMountedComponent = setupGetMountedComponent(TYPE)
    beforeAll(() => {
      origAddEventListener = document.addEventListener
      origRemoveEventListener = document.removeEventListener
    })
    beforeEach(() => {
      // track eventListener adds to trigger later
      // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
      eventListenerMapDocument = mockListenersSetup(document)
    })
    afterAll(() => {
      document.eventListener = origAddEventListener
      document.removeEventListener = origRemoveEventListener
    })

    it('handles touch events and fires correct props', () => {
      const swipeFuncs = getMockedSwipeFunctions()
      const { eventListenerMap } = getMountedComponent({ ...swipeFuncs })

      eventListenerMap.touchstart(cte({ x: 100, y: 100, timeStamp: 8077.299999946263 }))

      eventListenerMap.touchmove(cte({ x: 100, y: 125, timeStamp: 8100.999999966007 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150, timeStamp: 8116.899999964517 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 175, timeStamp: 8122.799999953713 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 200, timeStamp: 8130.199999955433 }))
      eventListenerMap.touchend(cte({}))

      expect(swipeFuncs.onSwipedDown).toHaveBeenCalled()
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwiped.mock.calls).toMatchSnapshot(`${TYPE} onSwiped trackTouch`)
      expect(swipeFuncs.onSwiping.mock.calls).toMatchSnapshot(`${TYPE} onSwiping trackTouch`)
    })

    it('handles mouse events with trackMouse prop and fires correct props', () => {
      const swipeFuncs = getMockedSwipeFunctions()
      const preventDefault = jest.fn()
      const e = { preventDefault }
      const { wrapper } = getMountedComponent({
        ...swipeFuncs,
        trackMouse: true,
        trackTouch: false,
        preventDefaultTouchmoveEvent: true
      })

      const touchHere = wrapper.find('span')
      touchHere.simulate('mouseDown', cme({ x: 100, y: 100, timeStamp: 1374809.499999974 }))

      eventListenerMapDocument.mousemove(
        cme({ x: 125, y: 100, timeStamp: 1374825.199999963, ...e })
      )
      eventListenerMapDocument.mousemove(
        cme({ x: 150, y: 100, timeStamp: 1374841.3999999757, ...e })
      )
      eventListenerMapDocument.mousemove(
        cme({ x: 175, y: 100, timeStamp: 1374857.399999979, ...e })
      )
      eventListenerMapDocument.mousemove(
        cme({ x: 200, y: 100, timeStamp: 1374873.499999987, ...e })
      )
      eventListenerMapDocument.mouseup({})

      expect(preventDefault).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalled()
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwiped.mock.calls).toMatchSnapshot(`${TYPE} onSwiped trackMouse`)
      expect(swipeFuncs.onSwiping.mock.calls).toMatchSnapshot(`${TYPE} onSwiping trackMouse`)
    })

    it('calls preventDefault when swiping in direction that has a callback', () => {
      const onSwipedDown = jest.fn()
      const preventDefault = jest.fn()
      const cancelable = true
      const e = { preventDefault, cancelable }
      const { eventListenerMap } = getMountedComponent({
        onSwipedDown,
        preventDefaultTouchmoveEvent: true
      })

      eventListenerMap.touchstart(cte({ x: 100, y: 100, ...e }))

      eventListenerMap.touchmove(cte({ x: 100, y: 125, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 175, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 200, ...e }))
      eventListenerMap.touchend({ ...e })

      expect(onSwipedDown).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalledTimes(4)
    })

    it('does not call preventDefault when false', () => {
      const onSwipedUp = jest.fn()
      const preventDefault = jest.fn()
      const e = { preventDefault }
      const { eventListenerMap } = getMountedComponent({ onSwipedUp })

      eventListenerMap.touchstart(cte({ x: 100, y: 100, ...e }))

      eventListenerMap.touchmove(cte({ x: 100, y: 75, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 25, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, ...e }))
      eventListenerMap.touchend({ ...e })

      expect(onSwipedUp).toHaveBeenCalled()

      expect(preventDefault).not.toHaveBeenCalled()
    })

    it('calls preventDefault when onSwiping is present', () => {
      const onSwiping = jest.fn()
      const preventDefault = jest.fn()
      const cancelable = true
      const { eventListenerMap } = getMountedComponent({
        onSwiping,
        preventDefaultTouchmoveEvent: true
      })

      eventListenerMap.touchstart(cte({ x: 100, y: 100, preventDefault, cancelable }))

      eventListenerMap.touchmove(cte({ x: 100, y: 50, preventDefault, cancelable }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, preventDefault, cancelable }))
      eventListenerMap.touchend({ preventDefault, cancelable })

      expect(onSwiping).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalled()
    })

    it('calls preventDefault when onSwiped is present', () => {
      const onSwiped = jest.fn()
      const preventDefault = jest.fn()
      const cancelable = true
      const { eventListenerMap } = getMountedComponent({
        onSwiped,
        preventDefaultTouchmoveEvent: true
      })

      eventListenerMap.touchstart(cte({ x: 100, y: 100, preventDefault, cancelable }))

      eventListenerMap.touchmove(cte({ x: 100, y: 50, preventDefault, cancelable }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, preventDefault, cancelable }))
      eventListenerMap.touchend({ preventDefault, cancelable })

      expect(onSwiped).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalled()
    })

    it('does not re-check delta when swiping already in progress', () => {
      const onSwiping = jest.fn()
      const onSwipedRight = jest.fn()
      const onSwipedLeft = jest.fn()
      const { eventListenerMap } = getMountedComponent({
        onSwiping,
        onSwipedRight,
        onSwipedLeft,
        trackMouse: true,
        delta: 40
      })

      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))

      eventListenerMap.touchmove(cte({ x: 145, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 80, y: 100 }))
      eventListenerMap.touchend({})

      expect(onSwiping).toHaveBeenCalledTimes(2)
      expect(onSwiping.mock.calls[0][0].dir).toBe(RIGHT)
      expect(onSwiping.mock.calls[1][0].dir).toBe(LEFT)
      expect(onSwipedLeft).toHaveBeenCalledTimes(1)
      expect(onSwipedRight).not.toHaveBeenCalled()
    })

    it('Handle Rotation by 90 degree', () => {
      const swipeFuncsRight = getMockedSwipeFunctions()

      const { eventListenerMap, wrapper } = getMountedComponent({
        ...swipeFuncsRight,
        rotationAngle: 90
      })

      // check right
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsRight, RIGHT)

      // check left
      const swipeFuncsLeft = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsLeft, rotationAngle: 90 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 75 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsLeft, LEFT)

      // check up
      const swipeFuncsUp = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsUp, rotationAngle: 90 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 125, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 150, y: 100 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsUp, UP)

      // check down
      const swipeFuncsDown = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsDown, rotationAngle: 90 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 75, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 50, y: 100 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsDown, DOWN)
    })

    it('Handle "odd" rotations', () => {
      const swipeFuncsNegativeRotation = getMockedSwipeFunctions()

      const { eventListenerMap, wrapper } = getMountedComponent({
        ...swipeFuncsNegativeRotation,
        rotationAngle: -90
      })

      // check -90
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsNegativeRotation, 'Left')

      // check 360 + 270
      const swipeFuncsLargeRotation = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsLargeRotation, rotationAngle: 360 + 270 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsLargeRotation, 'Left')
    })

    it('Handle Rotation that changes so keep the direction the same', () => {
      const swipeFuncs = getMockedSwipeFunctions()

      const { eventListenerMap, wrapper } = getMountedComponent({ ...swipeFuncs })

      // check 0
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 125, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 150, y: 100 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(1)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(1)

      // check 90
      wrapper.setProps({ rotationAngle: 90 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(2)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(2)

      // check 180
      wrapper.setProps({ rotationAngle: 180 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 75, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 50, y: 100 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(3)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(3)

      // check 270
      wrapper.setProps({ rotationAngle: 270 })
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 75 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(4)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(4)

      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(8)
      ;[LEFT, UP, DOWN].forEach(dir => {
        expect(swipeFuncs[`onSwiped${dir}`]).not.toHaveBeenCalled()
      })
    })

    it('Cleans up and re-attaches touch event listeners if trackTouch changes', () => {
      let spies
      const mockListeners = el => {
        // already spying
        if (spies) return
        spies = {}
        spies.addEventListener = jest.spyOn(el, 'addEventListener')
        spies.removeEventListener = jest.spyOn(el, 'removeEventListener')
      }
      const { wrapper } = setupGetMountedComponent(TYPE, mockListeners)({})
      expect(spies.addEventListener).toHaveBeenCalledTimes(3)
      expect(spies.removeEventListener).not.toHaveBeenCalled()
      wrapper.setProps({ trackTouch: false })
      expect(spies.addEventListener).toHaveBeenCalledTimes(3)
      expect(spies.removeEventListener).toHaveBeenCalledTimes(3)
      // VERIFY REMOVED HANDLERS ARE THE SAME ONES THAT WERE ADDED!
      expect(spies.addEventListener.mock.calls.length).toBe(3)
      spies.addEventListener.mock.calls.forEach((call, idx) => {
        expect(spies.removeEventListener.mock.calls[idx][0]).toBe(call[0])
        expect(spies.removeEventListener.mock.calls[idx][1]).toBe(call[1])
      })

      wrapper.setProps({ trackTouch: true })
      expect(spies.addEventListener).toHaveBeenCalledTimes(6)
      expect(spies.removeEventListener).toHaveBeenCalledTimes(3)
    })

    it('Cleans up and re-attaches touch event listeners if the DOM element changes', () => {
      let spies
      const mockListeners = el => {
        // already spying
        if (spies) return
        spies = {}
        spies.addEventListener = jest.spyOn(el, 'addEventListener')
        spies.removeEventListener = jest.spyOn(el, 'removeEventListener')
      }
      const { wrapper } = setupGetMountedComponent(TYPE, mockListeners)({})

      expect(spies.addEventListener).toHaveBeenCalledTimes(3)
      expect(spies.removeEventListener).not.toHaveBeenCalled()

      wrapper.setProps({ nodeName: 'p' })

      expect(spies.addEventListener).toHaveBeenCalledTimes(3)
      expect(spies.removeEventListener).toHaveBeenCalledTimes(3)
      // VERIFY REMOVED HANDLERS ARE THE SAME ONES THAT WERE ADDED!
      expect(spies.addEventListener.mock.calls.length).toBe(3)
      spies.addEventListener.mock.calls.forEach((call, idx) => {
        expect(spies.removeEventListener.mock.calls[idx][0]).toBe(call[0])
        expect(spies.removeEventListener.mock.calls[idx][1]).toBe(call[1])
      })
    })
  })

  it(`${TYPE} handles updated prop swipe callbacks`, () => {
    let eventListenerMap
    const innerRef = el => {
      // don't re-assign eventlistener map
      if (!eventListenerMap) eventListenerMap = mockListenersSetup(el)
    }
    const onSwipedLeft = jest.fn()

    function TestHookComponent({ next }) {
      const handlers = useSwipeable({ onSwipedLeft: next })
      // Use innerRef to access the mounted div for testing.
      const ref = el => (innerRef(el), handlers.ref(el))
      return <div {...handlers} ref={ref} />
    }
    TestHookComponent.propTypes = {
      next: PropTypes.func.isRequired
    }

    function TestComponent() {
      const [page, setPage] = React.useState(0)
      const next = () => (setPage(page + 1), onSwipedLeft(page + 1))

      if (TYPE === USESWIPEABLE) {
        return <TestHookComponent next={next} />
      }
      if (TYPE === SWIPEABLE) {
        // Use innerRef to access the mounted div for testing.
        const ref = el => innerRef(el)
        return <Swipeable onSwipedLeft={next} innerRef={ref} />
      }
    }

    mount(<TestComponent />)

    const pages = [1, 2, 3]
    // swipe left 3 times
    pages.forEach(() => {
      eventListenerMap.touchstart(cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 75, y: 100 }))
      eventListenerMap.touchend({})
    })
    pages.forEach((page, idx) => {
      expect(onSwipedLeft.mock.calls[idx][0]).toBe(page)
    })
  })
})

describe('Swipeable Specific', () => {
  it('renders children', () => {
    const wrapper = mount(
      <Swipeable>
        <div data-testref="child">One</div>
        <div data-testref="child">Two</div>
      </Swipeable>
    )
    expect(wrapper.find({ 'data-testref': 'child' })).toHaveLength(2)
    wrapper.unmount()
  })

  it("should pass ref to Swipeable's div", () => {
    const WrapperComp = class extends React.Component {
      static displayName = 'WrapperComp'
      constructor(props) {
        super(props)
      }
      assignRef = el => {
        this.testRef = el
      }
      render() {
        return <Swipeable innerRef={this.assignRef} />
      }
    }
    const wrapper = mount(<WrapperComp />)
    const swipeableDiv = wrapper.find('div').instance()
    expect(wrapper.instance().testRef).toBe(swipeableDiv)
    wrapper.unmount()
  })
})
