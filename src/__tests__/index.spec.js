/* global document */
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Swipeable, useSwipeable } from '../index';
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

function SwipeableUsingHook(props) {
  const eventHandlers = useSwipeable(props);
  return (<div {...eventHandlers}>{props.children}</div>);
}

function setupGetMountedComponent(type) {
  return (props) => {
    if (type === 'Swipeable') {
      return mount((
        <Swipeable {...props}>
          <span>Touch Here</span>
        </Swipeable>
      ));
    } else if (type === 'useSwipeable') {
      return mount((
        <SwipeableUsingHook {...props}>
          <span>Touch Here</span>
        </SwipeableUsingHook>
      ));
    }
  };
}

['useSwipeable', 'Swipeable'].forEach((type) => {
  describe(`${type}`, () => {
    let origEventListener;
    let origRemoveEventListener;
    let eventListenerMap;
    const getMountedComponent = setupGetMountedComponent(type);
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

    it('does not re-check delta when swiping already in progress', () => {
      const onSwiping = jest.fn();
      const onSwipedRight = jest.fn();
      const onSwipingRight = jest.fn();
      const onSwipingLeft = jest.fn();
      const onSwipedLeft = jest.fn();
      const wrapper = getMountedComponent({
        onSwiping,
        onSwipingLeft,
        onSwipingRight,
        onSwipedRight,
        onSwipedLeft,
        trackMouse: true,
        delta: 40,
      });

      const touchHere = wrapper.find('span');
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));

      eventListenerMap.touchmove(createTouchEventObject({ x: 145, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 80, y: 100 }));
      eventListenerMap.touchend({});

      expect(onSwiping).toHaveBeenCalledTimes(2);
      expect(onSwipingRight).toHaveBeenCalledTimes(1);
      expect(onSwipingLeft).toHaveBeenCalledTimes(1);
      expect(onSwipedLeft).toHaveBeenCalledTimes(1);
      expect(onSwipedRight).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it('Handle Rotation by 90 degree', () => {
      const swipeFuncsRight = getMockedSwipeFunctions();

      const wrapper = getMountedComponent({ ...swipeFuncsRight, rotationAngle: 90 });
      const touchHere = wrapper.find('span');

      const expectDir = (sf, dir) => Object.keys(sf).forEach((s) => {
        if (s.endsWith(dir) || s === 'onSwiped' || s === 'onSwiping') {
          expect(sf[s]).toHaveBeenCalled();
        } else {
          expect(sf[s]).not.toHaveBeenCalled();
        }
      });

      // check right
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsRight, 'Right');

      // check left
      const swipeFuncsLeft = getMockedSwipeFunctions();
      wrapper.setProps({ ...swipeFuncsLeft, rotationAngle: 90 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 75 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 50 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsLeft, 'Left');

      // check up
      const swipeFuncsUp = getMockedSwipeFunctions();
      wrapper.setProps({ ...swipeFuncsUp, rotationAngle: 90 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 125, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 150, y: 100 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsUp, 'Up');

      // check down
      const swipeFuncsDown = getMockedSwipeFunctions();
      wrapper.setProps({ ...swipeFuncsDown, rotationAngle: 90 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 75, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 50, y: 100 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsDown, 'Down');

      wrapper.unmount();
    });

    it('Handle "odd" rotations', () => {
      const swipeFuncsNegativeRotation = getMockedSwipeFunctions();

      const wrapper = getMountedComponent({ ...swipeFuncsNegativeRotation, rotationAngle: -90 });
      const touchHere = wrapper.find('span');

      const expectDir = (sf, dir) => Object.keys(sf).forEach((s) => {
        if (s.endsWith(dir) || s === 'onSwiped' || s === 'onSwiping') {
          expect(sf[s]).toHaveBeenCalled();
        } else {
          expect(sf[s]).not.toHaveBeenCalled();
        }
      });

      // check -90
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsNegativeRotation, 'Left');

      // check 360 + 270
      const swipeFuncsLargeRotation = getMockedSwipeFunctions();
      wrapper.setProps({ ...swipeFuncsLargeRotation, rotationAngle: 360 + 270 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150 }));
      eventListenerMap.touchend({});
      expectDir(swipeFuncsLargeRotation, 'Left');

      wrapper.unmount();
    });

    it('Handle Rotation that changes so keep the direction the same', () => {
      const swipeFuncs = getMockedSwipeFunctions();

      const wrapper = getMountedComponent({ ...swipeFuncs });
      const touchHere = wrapper.find('span');

      // check 0
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 125, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 150, y: 100 }));
      eventListenerMap.touchend({});
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(1);
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(1);

      // check 90
      wrapper.setProps({ rotationAngle: 90 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 125 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 150 }));
      eventListenerMap.touchend({});
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(2);
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(2);

      // check 180
      wrapper.setProps({ rotationAngle: 180 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 75, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 50, y: 100 }));
      eventListenerMap.touchend({});
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(3);
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(3);

      // check 270
      wrapper.setProps({ rotationAngle: 270 });
      touchHere.simulate('touchStart', createTouchEventObject({ x: 100, y: 100 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 75 }));
      eventListenerMap.touchmove(createTouchEventObject({ x: 100, y: 50 }));
      eventListenerMap.touchend({});
      expect(swipeFuncs.onSwiped).toHaveBeenCalledTimes(4);
      expect(swipeFuncs.onSwipedRight).toHaveBeenCalledTimes(4);

      expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(8);

      ['Left', 'Up', 'Down'].forEach((dir) => {
        expect(swipeFuncs[`onSwiped${dir}`]).not.toHaveBeenCalled();
        expect(swipeFuncs[`onSwiping${dir}`]).not.toHaveBeenCalled();
      });

      wrapper.unmount();
    });
  });
});

describe('Swipeable Specific', () => {
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

  it('should pass ref to Swipeable\'s div', () => {
    const WrapperComp = class extends React.Component {
      constructor(props) {
        super(props);
        this.testRef = React.createRef();
      }
      render() {
        return <Swipeable innerRef={this.testRef} /> // eslint-disable-line
      }
    };
    const wrapper = mount((<WrapperComp />));
    const swipeableDiv = wrapper.find('div').instance();
    expect(wrapper.instance().testRef.current).toBe(swipeableDiv);
    wrapper.unmount();
  });
});
