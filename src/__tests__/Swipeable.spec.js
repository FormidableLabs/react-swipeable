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
    const wrapper = mount((
      <Swipeable
        {...swipeFuncs}
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
    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
  });

  it('handles mouse events with trackMouse prop and fires correct props', () => {
    const swipeFuncs = getMockedSwipeFunctions();
    const wrapper = mount((
      <Swipeable
        trackMouse={true}
        {...swipeFuncs}
      >
        <span>Touch Here</span>
      </Swipeable>
    ));

    const touchHere = wrapper.find('span');
    touchHere.simulate('mouseDown', createStartTouchEventObject({ x: 100, y: 100 }));
    touchHere.simulate('mouseMove', createMoveTouchEventObject({ x: 125, y: 100 }));
    touchHere.simulate('mouseMove', createMoveTouchEventObject({ x: 150, y: 100 }));
    touchHere.simulate('mouseMove', createMoveTouchEventObject({ x: 175, y: 100 }));
    touchHere.simulate('mouseUp', createMoveTouchEventObject({ x: 200, y: 100 }));

    expect(swipeFuncs.onSwipedRight).toHaveBeenCalled();
    expect(swipeFuncs.onSwipingRight).toHaveBeenCalledTimes(3);
    expect(swipeFuncs.onSwipedUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingUp).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingDown).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipedLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwipingLeft).not.toHaveBeenCalled();
    expect(swipeFuncs.onSwiped).toHaveBeenCalled();
    expect(swipeFuncs.onSwiping).toHaveBeenCalledTimes(3);
  });
});
