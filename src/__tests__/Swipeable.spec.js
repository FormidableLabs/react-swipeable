/* global document */
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import to later mock
import DetectPassiveEvents from 'detect-passive-events';
import Swipeable from '../Swipeable';
import {
  createTouchEventObject,
  createMouseEventObject,
} from './helpers/events';

const { mount } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

const DIRECTIONS = ['Left', 'Right', 'Up', 'Down'];

function getMockedSwipeFunctions() {
  return DIRECTIONS.reduce((acc, dir) => {
    acc[`onSwiped${dir}`] = jest.fn(); // eslint-disable-line
    acc[`onSwiping${dir}`] = jest.fn(); // eslint-disable-line
    return acc;
  }, {
    onSwiping: jest.fn(),
    onSwiped: jest.fn(),
  });
}

function mockListenerSetup(el) {
  // track eventListener adds to trigger later
  // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
  const eventListenerMap = {};
  el.addEventListener = jest.fn((event, cb) => { // eslint-disable-line no-param-reassign
    // console.log('add-', event, cb);
    eventListenerMap[event] = cb;
  });
  el.removeEventListener = jest.fn((event, cb) => { // eslint-disable-line no-param-reassign
    if (eventListenerMap[event] === cb) delete eventListenerMap[event];
  });
  return eventListenerMap;
}

function getMountedComponent(props) {
  return mount((
    <Swipeable {...props}>
      <span>Touch Here</span>
    </Swipeable>
  ));
}

describe('Swipeable', () => {
  let origEventListener;
  let origRemoveEventListener;
  let eventListenerMap;
  beforeAll(() => {
    origEventListener = document.eventListener;
    origRemoveEventListener = document.removeEventListener;
  });
  beforeEach(() => {
    // track eventListener adds to trigger later
    // idea from - https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
    eventListenerMap = mockListenerSetup(document);
  });
  afterAll(() => {
    document.eventListener = origEventListener;
    document.removeEventListener = origRemoveEventListener;
  });

  it('renders children', () => {
    const wrapper = mount((
      <Swipeable>
        <div data-testref="child">One</div>
        <div data-testref="child">Two</div>
      </Swipeable>
    ));
    expect(wrapper.find({ 'data-testref': 'child' })).toHaveLength(2);
    wrapper.unmount();
  });

  it('handles touch events and fires correct props', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();
    const wrapper = getMountedComponent({ ...swipeFuncs, onTap });

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125 }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150 }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 175 }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 200 }));
    eventListenerMap.touchend(createTouchEventObject({}));

    expect(swipeFuncs.onSwipedDown).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).toHaveBeenCalledTimes(4);
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(4);
    wrapper.unmount();
  });

  it('handles mouse events with trackMouse prop and fires correct props', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onMouseDown = jest.fn();
    const onTap = jest.fn();
    const wrapper = getMountedComponent({ ...swipeFuncs, onMouseDown, trackMouse: true, onTap });

    const touchHere = wrapper.find('span');
    touchHere.simulate('mouseDown', createMouseEventObject({ x: 100, y: 100 }));

    eventListenerMap.mousemove(createMouseEventObject({ x: 125, y: 100 }));
    eventListenerMap.mousemove(createMouseEventObject({ x: 150, y: 100 }));
    eventListenerMap.mousemove(createMouseEventObject({ x: 175, y: 100 }));
    eventListenerMap.mousemove(createMouseEventObject({ x: 200, y: 100 }));
    eventListenerMap.mouseup({});

    expect(swipeFuncs.onSwipedRight).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).toHaveBeenCalledTimes(4);
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(4);

    // still calls passed through mouse event prop
    // TODO: FIGURE THIS OUT?!
    // expect(onMouseDown).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('calls onTap', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();
    const wrapper = getMountedComponent({ ...swipeFuncs, onTap });

    const touchHere = wrapper.find('span');
    // simulate what is probably a light tap,
    // meaning the user "swiped" just a little, but less than the delta
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 103, y: 100 }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 107, y: 100 }));
    eventListenerMap.touchend({});

    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).not.toHaveBeenCalled();

    expect(onTap).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('calls preventDefault correctly when swiping in direction that has a callback', () => {
    const onSwipedDown = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = mount((
      <Swipeable
        onSwipedDown={onSwipedDown}
        preventDefaultTouchmoveEvent={true}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100, preventDefault }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 175, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 200, preventDefault }));
    eventListenerMap.touchend({ preventDefault });

    expect(onSwipedDown).toHaveBeenCalled();

    expect(preventDefault).toHaveBeenCalledTimes(4);
    wrapper.unmount();
  });

  it('does not call preventDefault when false', () => {
    const onSwipedUp = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = getMountedComponent({ onSwipedUp, preventDefaultTouchmoveEvent: false });

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchstart', createTouchEventObject({ x: 100, y: 100, preventDefault }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 75, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 50, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 25, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 5, preventDefault }));
    eventListenerMap.touchend({ preventDefault });

    expect(onSwipedUp).toHaveBeenCalled();

    expect(preventDefault).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('calls preventDefault when onSwiping is present', () => {
    const onSwiping = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = getMountedComponent({ onSwiping });

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100, preventDefault }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 50, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 5, preventDefault }));
    eventListenerMap.touchend({ preventDefault });

    expect(onSwiping).toHaveBeenCalled();

    expect(preventDefault).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('calls preventDefault when onSwiped is present', () => {
    const onSwiped = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = getMountedComponent({ onSwiped });

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100, preventDefault }));

    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 50, preventDefault }));
    eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 5, preventDefault }));
    eventListenerMap.touchend({ preventDefault });

    expect(onSwiped).toHaveBeenCalled();

    expect(preventDefault).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('disables swipeable with disabled prop using touch swipe', () => {
    const onSwiping = jest.fn();
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const wrapper = getMountedComponent({ onSwipedRight, onSwipedLeft, onSwiping });

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 125, y: 100 }));

    // DISABLE swipeable "mid swipe action"
    wrapper.setProps({ disabled: true });

    // no longer tracking a 'swipe'
    const swipeableInstance = wrapper.instance();
    // check internal saved state
    expect(swipeableInstance.swipeable.swiping).toBe(false);

    touchHere.simulate('touchMove', createTouchEventObject({ x: 150, y: 100 }));
    touchHere.simulate('touchEnd', createTouchEventObject({ x: 175, y: 100 }));

    expect(onSwiping).toHaveBeenCalledTimes(1);
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('disables swipeable with disabled prop using "mouse swipe"', () => {
    const onSwiping = jest.fn();
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const wrapper = mount((
      <Swipeable
        onSwiping={onSwiping}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        trackMouse={true}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('mouseDown', createMouseEventObject({ x: 100, y: 100 }));

    eventListenerMap.mousemove(createMouseEventObject({ x: 125, y: 100 }));

    // DISABLE swipeable "mid swipe action"
    wrapper.setProps({ disabled: true });

    // no longer tracking a 'swipe'
    const swipeableInstance = wrapper.instance();
    // check internal saved state
    expect(swipeableInstance.swipeable.swiping).toBe(false);

    expect(eventListenerMap.mousemove).toBe(undefined);
    expect(eventListenerMap.mouseup).toBe(undefined);

    expect(onSwiping).toHaveBeenCalledTimes(1);
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('does not check delta when swiping in progress', () => {
    const onSwiping = jest.fn();
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const wrapper = mount((
      <Swipeable
        onSwiping={onSwiping}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
        delta={40}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 145, y: 100 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 80, y: 100 }));
    touchHere.simulate('touchEnd', createTouchEventObject({ x: 80, y: 100 }));

    expect(onSwiping).toHaveBeenCalledTimes(2);
    expect(onSwipedLeft).toHaveBeenCalledTimes(1);
    expect(onSwipedRight).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should pass ref to the component via innerRef prop', () => {
    const WrapperComp = class extends React.Component {
      render() {
        return <Swipeable innerRef={el => this.testRef = el} /> // eslint-disable-line
      }
    };
    const wrapper = mount((<WrapperComp />));
    const swipeableDiv = wrapper.find('div').instance();
    expect(wrapper.instance().testRef).toBe(swipeableDiv);
    wrapper.unmount();
  });


  describe('preventDefaultTouchmoveEvent and passive support eventListener option', () => {
    beforeAll(() => {
      DetectPassiveEvents.hasSupport = true;
    });
    afterAll(() => {
      DetectPassiveEvents.hasSupport = false;
    });
    it('should setup touchmove event listener correctly', () => {
      // set hasSupport to true for this test
      const wrapper = mount((
        <Swipeable preventDefaultTouchmoveEvent={true} >
          <span>Touch Here</span>
        </Swipeable>
      ));
      const instance = wrapper.instance();
      const element = instance.element;
      // mock eventListeners
      const elementListenerMap = mockListenerSetup(element);

      // re-call did mount again after we've mocked the listeners
      instance.componentDidMount();
      expect(element.addEventListener).toHaveBeenCalledTimes(1);
      expect(elementListenerMap.touchmove).toBe(instance.eventMove);

      // the swipeable div should not be tracking 'touchmove' events
      let swipeableDiv = wrapper.find('div');
      expect(swipeableDiv.prop('onTouchMove')).toBe(undefined);

      // toggle preventDefaultTouchmoveEvent off
      wrapper.setProps({ preventDefaultTouchmoveEvent: false });

      expect(element.removeEventListener).toHaveBeenCalledTimes(1);
      expect(elementListenerMap.touchmove).toBe(undefined);

      // verify that onTouchMove prop was re-assigned to inner div
      swipeableDiv = wrapper.find('div');
      expect(swipeableDiv.prop('onTouchMove')).toBe(instance.eventMove);
    });
  });

  describe('Handle Rotation by 90 degree: ', () => {
    let wrapper = {};
    let touchHere = {};
    let swipeFuncs = {};
    let onTap = () => {};

    beforeEach(() => {
      swipeFuncs = getMockedSwipeFunctions();
      onTap = jest.fn();

      wrapper = mount((
        <Swipeable
          {...swipeFuncs}
          onTap={onTap}
          rotationAngle={90}
        >
          <span>Touch Here</span>
        </Swipeable>
      ));

      touchHere = wrapper.find('span');
    });

    afterEach(() => {
      wrapper.unmount();
      touchHere = {};
    });

    it('handles swipe direction to the right', () => {
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 125 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 150 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 175 }));
      touchHere.simulate('touchEnd', createTouchEventObject({ x: 100, y: 200 }));

      expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwipedRight).toHaveBeenCalled();
      expect(swipeFuncs.onSwipingRight).toHaveBeenCalledTimes(3);

      expect(onTap).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwiped).toHaveBeenCalled();
      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
    });

    it('handles swipe direction to the left', () => {
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 75 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 50 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 25 }));
      touchHere.simulate('touchEnd', createTouchEventObject({ x: 100, y: 0 }));

      expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwipedLeft).toHaveBeenCalled();
      expect(swipeFuncs.onSwipingLeft).toHaveBeenCalledTimes(3);

      expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalled();
      expect(onTap).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwiped).toHaveBeenCalled();
      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
    });

    it('handles swipe direction upwards', () => {
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 125, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 150, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 175, y: 100 }));
      touchHere.simulate('touchEnd', createTouchEventObject({ x: 200, y: 100 }));

      expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwipedUp).toHaveBeenCalled();
      expect(swipeFuncs.onSwipingUp).toHaveBeenCalledTimes(3);

      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalled();
      expect(onTap).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwiped).toHaveBeenCalled();
      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
    });

    it('handles swipe direction downwards', () => {
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 75, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 50, y: 100 }));
      touchHere.simulate('touchMove', createTouchEventObject({ x: 25, y: 100 }));
      touchHere.simulate('touchEnd', createTouchEventObject({ x: 0, y: 100 }));

      expect(swipeFuncs.onSwipedDown).toHaveBeenCalled();
      expect(swipeFuncs.onSwipingDown).toHaveBeenCalledTimes(3);

      expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
      expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalled();
      expect(onTap).not.toHaveBeenCalled();

      expect(swipeFuncs.onSwiped).toHaveBeenCalled();
      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
    });
  });


  it('Handle Rotation by negative 90 degree', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();

    const wrapper = mount((
      <Swipeable
        {...swipeFuncs}
        onTap={onTap}
        rotationAngle={-90}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');

    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 125 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 150 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 175 }));
    touchHere.simulate('touchEnd', createTouchEventObject({ x: 100, y: 200 }));

    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();

    expect(swipeFuncs.onSwipedLeft).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).toHaveBeenCalled();

    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalledTimes(3);

    expect(onTap).not.toHaveBeenCalled();

    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);

    wrapper.unmount();
  });


  it('Handle Rotation by more than 360 degree', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();

    const wrapper = mount((
      <Swipeable
        {...swipeFuncs}
        onTap={onTap}
        rotationAngle={360 + 270}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');

    touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 125 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 150 }));
    touchHere.simulate('touchMove', createTouchEventObject({ x: 100, y: 175 }));
    touchHere.simulate('touchEnd', createTouchEventObject({ x: 100, y: 200 }));

    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();

    expect(swipeFuncs.onSwipedLeft).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).toHaveBeenCalled();

    expect(swipeFuncs.onSwipedRight).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).not.toHaveBeenCalledTimes(3);

    expect(onTap).not.toHaveBeenCalled();

    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);

    wrapper.unmount();
  });
});
