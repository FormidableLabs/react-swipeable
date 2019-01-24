/* global document, jest, expect, beforeAll, afterAll */
import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Swipeable, useSwipeable, LEFT, RIGHT, UP, DOWN } from '../index'
import {
  createTouchEventObject as cte,
  createMouseEventObject as cme
} from './helpers/events'

const { mount } = Enzyme

Enzyme.configure({ adapter: new Adapter() })

const DIRECTIONS = [LEFT, RIGHT, UP, DOWN]

function getMockedSwipeFunctions() {
  return DIRECTIONS.reduce(
    (acc, dir) => ({ ...acc, [`onSwiped${dir}`]: jest.fn() }),
    { onSwiping: jest.fn(), onSwiped: jest.fn() }
  )
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

function mockListenerSetup(el) {
  // track eventListener adds to trigger later
  // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
  const eventListenerMap = {}
  el.addEventListener = jest.fn((event, cb) => {
    // eslint-disable-line no-param-reassign
    eventListenerMap[event] = cb
  })
  el.removeEventListener = jest.fn((event, cb) => {
    // eslint-disable-line no-param-reassign
    if (eventListenerMap[event] === cb) delete eventListenerMap[event]
  })
  return eventListenerMap
}

function SwipeableUsingHook(props) {
  const eventHandlers = useSwipeable(props)
  return <div {...eventHandlers}>{props.children}</div> // eslint-disable-line
}

function setupGetMountedComponent(type) {
  return props => {
    if (type === 'Swipeable') {
      return mount(
        <Swipeable {...props}>
          <span>Touch Here</span>
        </Swipeable>
      )
    } else if (type === 'useSwipeable') {
      return mount(
        <SwipeableUsingHook {...props}>
          <span>Touch Here</span>
        </SwipeableUsingHook>
      )
    }
  }
}

;['useSwipeable', 'Swipeable'].forEach(type => {
  describe(`${type}`, () => {
    let origEventListener
    let origRemoveEventListener
    let eventListenerMap
    const getMountedComponent = setupGetMountedComponent(type)
    beforeAll(() => {
      origEventListener = document.eventListener
      origRemoveEventListener = document.removeEventListener
    })
    beforeEach(() => {
      // track eventListener adds to trigger later
      // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
      eventListenerMap = mockListenerSetup(document)
    })
    afterAll(() => {
      document.eventListener = origEventListener
      document.removeEventListener = origRemoveEventListener
    })

    it('handles touch events and fires correct props', () => {
      const swipeFuncs = getMockedSwipeFunctions()
      const wrapper = getMountedComponent({ ...swipeFuncs })

      const touchHere = wrapper.find('span')
      touchHere.simulate(
        'touchStart',
        cte({ x: 100, y: 100, timeStamp: 8077.299999946263 })
      )

      eventListenerMap.touchmove(
        cte({ x: 100, y: 125, timeStamp: 8100.999999966007 })
      )
      eventListenerMap.touchmove(
        cte({ x: 100, y: 150, timeStamp: 8116.899999964517 })
      )
      eventListenerMap.touchmove(
        cte({ x: 100, y: 175, timeStamp: 8122.799999953713 })
      )
      eventListenerMap.touchmove(
        cte({ x: 100, y: 200, timeStamp: 8130.199999955433 })
      )
      eventListenerMap.touchend(cte({}))

      expect(swipeFuncs.onSwipedDown).toHaveBeenCalled()
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwiped.mock.calls).toMatchSnapshot(
        `${type} onSwiped trackTouch`
      )
      expect(swipeFuncs.onSwiping.mock.calls).toMatchSnapshot(
        `${type} onSwiping trackTouch`
      )

      wrapper.unmount()
    })

    it('handles mouse events with trackMouse prop and fires correct props', () => {
      const swipeFuncs = getMockedSwipeFunctions()
      const wrapper = getMountedComponent({
        ...swipeFuncs,
        trackMouse: true
      })

      const touchHere = wrapper.find('span')
      touchHere.simulate(
        'mouseDown',
        cme({ x: 100, y: 100, timeStamp: 1374809.499999974 })
      )

      eventListenerMap.mousemove(
        cme({ x: 125, y: 100, timeStamp: 1374825.199999963 })
      )
      eventListenerMap.mousemove(
        cme({ x: 150, y: 100, timeStamp: 1374841.3999999757 })
      )
      eventListenerMap.mousemove(
        cme({ x: 175, y: 100, timeStamp: 1374857.399999979 })
      )
      eventListenerMap.mousemove(
        cme({ x: 200, y: 100, timeStamp: 1374873.499999987 })
      )
      eventListenerMap.mouseup({})

      expect(swipeFuncs.onSwipedRight).toHaveBeenCalled()
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled()
      expect(swipeFuncs.onSwiped.mock.calls).toMatchSnapshot(
        `${type} onSwiped trackMouse`
      )
      expect(swipeFuncs.onSwiping.mock.calls).toMatchSnapshot(
        `${type} onSwiping trackMouse`
      )

      wrapper.unmount()
    })

    it('calls preventDefault + stopPropagation when swiping in direction that has a callback', () => {
      const onSwipedDown = jest.fn()
      const preventDefault = jest.fn()
      const stopPropagation = jest.fn()
      const e = { preventDefault, stopPropagation }
      const wrapper = getMountedComponent({
        onSwipedDown,
        stopPropagation: true
      })

      const touchHere = wrapper.find('span')
      touchHere.simulate('touchStart', cte({ x: 100, y: 100, ...e }))

      eventListenerMap.touchmove(cte({ x: 100, y: 125, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 175, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 200, ...e }))
      eventListenerMap.touchend({ ...e })

      expect(onSwipedDown).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalledTimes(4)
      expect(stopPropagation).toHaveBeenCalledTimes(5)
      wrapper.unmount()
    })

    it('does not call preventDefault when false', () => {
      const onSwipedUp = jest.fn()
      const preventDefault = jest.fn()
      const stopPropagation = jest.fn()
      const e = { preventDefault, stopPropagation }
      const wrapper = getMountedComponent({
        onSwipedUp,
        preventDefaultTouchmoveEvent: false
      })

      const touchHere = wrapper.find('span')
      touchHere.simulate('touchstart', cte({ x: 100, y: 100, ...e }))

      eventListenerMap.touchmove(cte({ x: 100, y: 75, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 25, ...e }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, ...e }))
      eventListenerMap.touchend({ ...e })

      expect(onSwipedUp).toHaveBeenCalled()

      expect(preventDefault).not.toHaveBeenCalled()
      expect(stopPropagation).not.toHaveBeenCalled()
      wrapper.unmount()
    })

    it('calls preventDefault when onSwiping is present', () => {
      const onSwiping = jest.fn()
      const preventDefault = jest.fn()
      const wrapper = getMountedComponent({ onSwiping })

      const touchHere = wrapper.find('span')
      touchHere.simulate('touchStart', cte({ x: 100, y: 100, preventDefault }))

      eventListenerMap.touchmove(cte({ x: 100, y: 50, preventDefault }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, preventDefault }))
      eventListenerMap.touchend({ preventDefault })

      expect(onSwiping).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('calls preventDefault when onSwiped is present', () => {
      const onSwiped = jest.fn()
      const preventDefault = jest.fn()
      const wrapper = getMountedComponent({ onSwiped })

      const touchHere = wrapper.find('span')
      touchHere.simulate('touchStart', cte({ x: 100, y: 100, preventDefault }))

      eventListenerMap.touchmove(cte({ x: 100, y: 50, preventDefault }))
      eventListenerMap.touchmove(cte({ x: 100, y: 5, preventDefault }))
      eventListenerMap.touchend({ preventDefault })

      expect(onSwiped).toHaveBeenCalled()

      expect(preventDefault).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('does not re-check delta when swiping already in progress', () => {
      const onSwiping = jest.fn()
      const onSwipedRight = jest.fn()
      const onSwipedLeft = jest.fn()
      const wrapper = getMountedComponent({
        onSwiping,
        onSwipedRight,
        onSwipedLeft,
        trackMouse: true,
        delta: 40
      })

      const touchHere = wrapper.find('span')
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))

      eventListenerMap.touchmove(cte({ x: 145, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 80, y: 100 }))
      eventListenerMap.touchend({})

      expect(onSwiping).toHaveBeenCalledTimes(2)
      expect(onSwiping.mock.calls[0][0].dir).toBe(RIGHT)
      expect(onSwiping.mock.calls[1][0].dir).toBe(LEFT)
      expect(onSwipedLeft).toHaveBeenCalledTimes(1)
      expect(onSwipedRight).not.toHaveBeenCalled()
      wrapper.unmount()
    })

    it('Handle Rotation by 90 degree', () => {
      const swipeFuncsRight = getMockedSwipeFunctions()

      const wrapper = getMountedComponent({
        ...swipeFuncsRight,
        rotationAngle: 90
      })
      const touchHere = wrapper.find('span')

      // check right
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsRight, RIGHT)

      // check left
      const swipeFuncsLeft = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsLeft, rotationAngle: 90 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 75 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsLeft, LEFT)

      // check up
      const swipeFuncsUp = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsUp, rotationAngle: 90 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 125, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 150, y: 100 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsUp, UP)

      // check down
      const swipeFuncsDown = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsDown, rotationAngle: 90 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 75, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 50, y: 100 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsDown, DOWN)

      wrapper.unmount()
    })

    it('Handle "odd" rotations', () => {
      const swipeFuncsNegativeRotation = getMockedSwipeFunctions()

      const wrapper = getMountedComponent({
        ...swipeFuncsNegativeRotation,
        rotationAngle: -90
      })
      const touchHere = wrapper.find('span')

      // check -90
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsNegativeRotation, 'Left')

      // check 360 + 270
      const swipeFuncsLargeRotation = getMockedSwipeFunctions()
      wrapper.setProps({ ...swipeFuncsLargeRotation, rotationAngle: 360 + 270 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expectSwipeFuncsDir(swipeFuncsLargeRotation, 'Left')

      wrapper.unmount()
    })

    it('Handle Rotation that changes so keep the direction the same', () => {
      const swipeFuncs = getMockedSwipeFunctions()

      const wrapper = getMountedComponent({ ...swipeFuncs })
      const touchHere = wrapper.find('span')

      // check 0
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 125, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 150, y: 100 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(1)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(1)

      // check 90
      wrapper.setProps({ rotationAngle: 90 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 125 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 150 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(2)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(2)

      // check 180
      wrapper.setProps({ rotationAngle: 180 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 75, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 50, y: 100 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(3)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(3)

      // check 270
      wrapper.setProps({ rotationAngle: 270 })
      touchHere.simulate('touchStart', cte({ x: 100, y: 100 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 75 }))
      eventListenerMap.touchmove(cte({ x: 100, y: 50 }))
      eventListenerMap.touchend({})
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(4)
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(4)

      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(8)
      ;[LEFT, UP, DOWN].forEach(dir => {
        expect(swipeFuncs[`onSwiped${dir}`]).not.toHaveBeenCalled()
      })

      wrapper.unmount()
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
        this.testRef = React.createRef()
      }
      render() {
        return <Swipeable innerRef={this.testRef} />
      }
    }
    const wrapper = mount(<WrapperComp />)
    const swipeableDiv = wrapper.find('div').instance()
    expect(wrapper.instance().testRef.current).toBe(swipeableDiv)
    wrapper.unmount()
  })
})
