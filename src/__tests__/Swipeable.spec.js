/* global document */
import React from 'react';
import { mount } from 'enzyme';
import Swipeable from '../Swipeable';
import {
  createStartTouchEventObject,
  createMoveTouchEventObject,
  createMouseEventObject,
} from './helpers/events';

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
    eventListenerMap = {};
    document.addEventListener = jest.fn((event, cb) => {
      eventListenerMap[event] = cb;
    });
    document.removeEventListener = jest.fn((event, cb) => {
      if (eventListenerMap[event] === cb) delete eventListenerMap[event];
    });
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
  });

  it('handles touch events and fires correct props', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();
    const wrapper = mount((
      <Swipeable
        {...swipeFuncs}
        onTap={onTap}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 125 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 150 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 175 }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 100, y: 200 }));

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

  it('handles mouse events with trackMouse prop and fires correct props', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onMouseDown = jest.fn();
    const onTap = jest.fn();
    const wrapper = mount((
      <div>
        <Swipeable
          trackMouse={true}
          onMouseDown={onMouseDown}
          onTap={onTap}
          {...swipeFuncs}
        >
          <span>Touch Here</span>
        </Swipeable>
        <div id="outsideElement" />
      </div>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('mouseDown', createMouseEventObject({ x: 100, y: 100 }));

    eventListenerMap.mousemove(createMouseEventObject({ x: 125, y: 100 }));
    eventListenerMap.mousemove(createMouseEventObject({ x: 150, y: 100 }));
    eventListenerMap.mousemove(createMouseEventObject({ x: 175, y: 100 }));
    eventListenerMap.mouseup(createMouseEventObject({ x: 200, y: 100 }));

    expect(swipeFuncs.onSwipedRight).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).toHaveBeenCalledTimes(3);
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);

    // still calls passed through mouse event prop
    expect(onMouseDown).toHaveBeenCalled();
  });

  it('calls onTap', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const onTap = jest.fn();
    const wrapper = mount((
      <Swipeable
        {...swipeFuncs}
        onTap={onTap}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    // simulate what is probably a light tap,
    // meaning the user "swiped" just a little, but less than the delta
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 103, y: 100 }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 107, y: 100 }));

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
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 125, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 150, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 175, preventDefault }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 100, y: 200, preventDefault }));

    expect(onSwipedDown).toHaveBeenCalled();

    expect(preventDefault).toHaveBeenCalledTimes(3);
  });

  it('does not call preventDefault when false', () => {
    const onSwipedUp = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = mount((
      <Swipeable
        onSwipedUp={onSwipedUp}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 75, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 50, preventDefault }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 100, y: 25, preventDefault }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 100, y: 5, preventDefault }));

    expect(onSwipedUp).toHaveBeenCalled();

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('disables swipeable with disabled prop using touch swipe', () => {
    const onSwiping = jest.fn();
    const onSwipedRight = jest.fn();
    const onSwipedLeft = jest.fn();
    const wrapper = mount((
      <Swipeable
        onSwiping={onSwiping}
        onSwipedRight={onSwipedRight}
        onSwipedLeft={onSwipedLeft}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 125, y: 100 }));

    // DISABLE swipeable "mid swipe action"
    wrapper.setProps({ disabled: true });

    // no longer tracking a 'swipe'
    const swipeableInstance = wrapper.instance();
    // check internal saved state
    expect(swipeableInstance.swipeable.swiping).toBe(false);

    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 150, y: 100 }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 175, y: 100 }));

    expect(onSwiping).toHaveBeenCalledTimes(1);
    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
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
    touchHere.simulate('touchStart', createStartTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 145, y: 100 }));
    touchHere.simulate('touchMove', createMoveTouchEventObject({ x: 80, y: 100 }));
    touchHere.simulate('touchEnd', createMoveTouchEventObject({ x: 80, y: 100 }));

    expect(onSwiping).toHaveBeenCalledTimes(2);
    expect(onSwipedLeft).toHaveBeenCalledTimes(1);
    expect(onSwipedRight).not.toHaveBeenCalled();
  });

  it('should pass ref to the component via innerRef prop', () => {
    const WrapperComp = class extends React.Component {
      render() {
        return <Swipeable innerRef={el => this.testRef = el} /> // eslint-disable-line
      }
    };
    const wrapper = mount((<WrapperComp />));
    const swipeableDiv = wrapper.find('div').getNode();
    expect(wrapper.node.testRef).toBe(swipeableDiv);
  });
});
