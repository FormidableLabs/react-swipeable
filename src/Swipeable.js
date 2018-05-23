/* global document */
const React = require('react');
const PropTypes = require('prop-types');
const DetectPassiveEvents = require('detect-passive-events').default;

function getInitialState() {
  return {
    x: null,
    y: null,
    swiping: false,
    start: 0,
  };
}

function getMovingPosition(e) {
  // If not a touch, determine point from mouse coordinates
  return 'changedTouches' in e
    ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
    : { x: e.clientX, y: e.clientY };
}
function getPosition(e) {
  // If not a touch, determine point from mouse coordinates
  return 'touches' in e
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };
}

function rotateByAngle(pos, angle) {
  if (angle === 0) {
    return pos;
  }

  const { x, y } = pos;

  const angleInRadians = (Math.PI / 180) * angle;
  const rotatedX = x * Math.cos(angleInRadians) + y * Math.sin(angleInRadians);
  const rotatedY = y * Math.cos(angleInRadians) - x * Math.sin(angleInRadians);
  return { x: rotatedX, y: rotatedY };
}

function calculatePos(e, state) {
  const { x, y } = rotateByAngle(getMovingPosition(e), state.rotationAngle);

  const deltaX = state.x - x;
  const deltaY = state.y - y;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  const time = Date.now() - state.start;
  const velocity = Math.sqrt(absX * absX + absY * absY) / time;

  return { deltaX, deltaY, absX, absY, velocity };
}

class Swipeable extends React.Component {
  constructor(props, context) {
    super(props, context);

    // setup internal swipeable state
    this.swipeable = getInitialState();

    // bind this context for internal methods
    this.eventStart = this.eventStart.bind(this);
    this.eventMove = this.eventMove.bind(this);
    this.eventEnd = this.eventEnd.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.cleanupMouseListeners = this.cleanupMouseListeners.bind(this);
    this.setupMouseListeners = this.setupMouseListeners.bind(this);
    this.elementRef = this.elementRef.bind(this);
    this.setupTouchmoveEvent = this.setupTouchmoveEvent.bind(this);
    this.cleanupTouchmoveEvent = this.cleanupTouchmoveEvent.bind(this);

    // check for passive event support
    this.hasPassiveSupport = DetectPassiveEvents.hasSupport;
  }

  componentDidMount() {
    // if we care about calling preventDefault and we have support for passive events
    // we need to setup a custom event listener, sigh...
    // there are a few jump ropes within the code for this case,
    // but it is the best we can do to allow preventDefault for chrome 56+
    if (this.props.preventDefaultTouchmoveEvent) {
      this.setupTouchmoveEvent();
    }
  }

  componentDidUpdate(prevProps) {
    // swipeable toggled either on/off, so stop tracking swipes and clean up
    if (prevProps.disabled !== this.props.disabled) {
      this.cleanupMouseListeners();
      // reset internal swipeable state
      this.swipeable = getInitialState();
    }

    // preventDefaultTouchmoveEvent toggled off - clean up touch move if needed
    if (prevProps.preventDefaultTouchmoveEvent && !this.props.preventDefaultTouchmoveEvent) {
      this.cleanupTouchmoveEvent();

    // preventDefaultTouchmoveEvent toggled on - add touch move if needed
    } else if (!prevProps.preventDefaultTouchmoveEvent && this.props.preventDefaultTouchmoveEvent) {
      this.setupTouchmoveEvent();
    }
  }

  componentWillUnmount() {
    this.cleanupMouseListeners();
  }

  setupTouchmoveEvent() {
    if (this.element && this.hasPassiveSupport) {
      this.element.addEventListener('touchmove', this.eventMove, { passive: false });
    }
  }

  setupMouseListeners() {
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  }

  cleanupTouchmoveEvent() {
    if (this.element && this.hasPassiveSupport) {
      this.element.removeEventListener('touchmove', this.eventMove, { passive: false });
    }
  }

  cleanupMouseListeners() {
    // safe to call, if no match is found has no effect
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.mouseUp);
  }

  mouseDown(e) {
    if (!this.props.trackMouse || e.type !== 'mousedown') {
      return;
    }
    // allow 'orig' props.onMouseDown to fire also
    // eslint-disable-next-line react/prop-types
    if (typeof this.props.onMouseDown === 'function') this.props.onMouseDown(e);

    // setup document listeners to track mouse movement outside <Swipeable>'s area
    this.setupMouseListeners();

    this.eventStart(e);
  }

  mouseMove(e) {
    this.eventMove(e);
  }

  mouseUp(e) {
    this.cleanupMouseListeners();
    this.eventEnd(e);
  }

  eventStart(e) {
    // if more than a single touch don't track, for now...
    if (e.touches && e.touches.length > 1) return;

    const { rotationAngle } = this.props;
    const { x, y } = rotateByAngle(getPosition(e), rotationAngle);

    if (this.props.stopPropagation) e.stopPropagation();

    this.swipeable = { start: Date.now(), x, y, swiping: false, rotationAngle };
  }

  eventMove(e) {
    const {
      stopPropagation,
      delta,
      onSwiping, onSwiped,
      onSwipingLeft, onSwipedLeft,
      onSwipingRight, onSwipedRight,
      onSwipingUp, onSwipedUp,
      onSwipingDown, onSwipedDown,
      preventDefaultTouchmoveEvent,
    } = this.props;

    if (!this.swipeable.x || !this.swipeable.y || e.touches && e.touches.length > 1) {
      return;
    }

    const pos = calculatePos(e, this.swipeable);

    // if swipe is under delta and we have not already started to track a swipe: return
    if (pos.absX < delta && pos.absY < delta && !this.swipeable.swiping) return;

    if (stopPropagation) e.stopPropagation();

    if (onSwiping) {
      onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY, pos.velocity);
    }

    // track if a swipe is cancelable
    // so we can call prevenDefault if needed
    let cancelablePageSwipe = false;
    if (onSwiping || onSwiped) {
      cancelablePageSwipe = true;
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (onSwipingLeft || onSwipedLeft) {
          onSwipingLeft && onSwipingLeft(e, pos.absX);
          cancelablePageSwipe = true;
        }
      } else if (onSwipingRight || onSwipedRight) {
        onSwipingRight && onSwipingRight(e, pos.absX);
        cancelablePageSwipe = true;
      }
    } else if (pos.deltaY > 0) {
      if (onSwipingUp || onSwipedUp) {
        onSwipingUp && onSwipingUp(e, pos.absY);
        cancelablePageSwipe = true;
      }
    } else if (onSwipingDown || onSwipedDown) {
      onSwipingDown && onSwipingDown(e, pos.absY);
      cancelablePageSwipe = true;
    }

    this.swipeable.swiping = true;

    if (cancelablePageSwipe && preventDefaultTouchmoveEvent) e.preventDefault();
  }

  eventEnd(e) {
    const {
      stopPropagation,
      flickThreshold,
      onSwiped,
      onSwipedLeft,
      onSwipedRight,
      onSwipedUp,
      onSwipedDown,
      onTap,
    } = this.props;

    if (this.swipeable.swiping) {
      const pos = calculatePos(e, this.swipeable);

      if (stopPropagation) e.stopPropagation();

      const isFlick = pos.velocity > flickThreshold;

      onSwiped && onSwiped(e, pos.deltaX, pos.deltaY, isFlick, pos.velocity);

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          onSwipedLeft && onSwipedLeft(e, pos.deltaX, isFlick);
        } else {
          onSwipedRight && onSwipedRight(e, pos.deltaX, isFlick);
        }
      } else if (pos.deltaY > 0) {
        onSwipedUp && onSwipedUp(e, pos.deltaY, isFlick);
      } else {
        onSwipedDown && onSwipedDown(e, pos.deltaY, isFlick);
      }
    } else {
      onTap && onTap(e);
    }

    // finished swipe tracking, reset swipeable state
    this.swipeable = getInitialState();
  }

  elementRef(element) {
    this.element = element;
    this.props.innerRef && this.props.innerRef(element);
  }

  render() {
    const newProps = { ...this.props };
    if (!this.props.disabled) {
      newProps.onTouchStart = this.eventStart;

      // if we do not care about calling preventDefault then assign onTouchMove prop
      // else we need to also check for passive support
      // and set a custom eventListener for touchmove on mount/update
      if (!this.props.preventDefaultTouchmoveEvent || !this.hasPassiveSupport) {
        newProps.onTouchMove = this.eventMove;
      }

      newProps.onTouchEnd = this.eventEnd;
      newProps.onMouseDown = this.mouseDown;
    }

    newProps.ref = this.elementRef;

    // clean up swipeable's props to avoid react warning
    delete newProps.onSwiped;
    delete newProps.onSwiping;
    delete newProps.onSwipingUp;
    delete newProps.onSwipingRight;
    delete newProps.onSwipingDown;
    delete newProps.onSwipingLeft;
    delete newProps.onSwipedUp;
    delete newProps.onSwipedRight;
    delete newProps.onSwipedDown;
    delete newProps.onSwipedLeft;
    delete newProps.onTap;
    delete newProps.flickThreshold;
    delete newProps.delta;
    delete newProps.preventDefaultTouchmoveEvent;
    delete newProps.stopPropagation;
    delete newProps.nodeName;
    delete newProps.children;
    delete newProps.trackMouse;
    delete newProps.disabled;
    delete newProps.innerRef;
    delete newProps.rotationAngle;

    return React.createElement(
      this.props.nodeName,
      newProps,
      this.props.children,
    );
  }
}

Swipeable.propTypes = {
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onSwipingUp: PropTypes.func,
  onSwipingRight: PropTypes.func,
  onSwipingDown: PropTypes.func,
  onSwipingLeft: PropTypes.func,
  onSwipedUp: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedDown: PropTypes.func,
  onSwipedLeft: PropTypes.func,
  onTap: PropTypes.func,
  flickThreshold: PropTypes.number,
  delta: PropTypes.number,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  stopPropagation: PropTypes.bool,
  nodeName: PropTypes.string,
  trackMouse: PropTypes.bool,
  disabled: PropTypes.bool,
  innerRef: PropTypes.func,
  children: PropTypes.node,
  rotationAngle: PropTypes.number,
};

Swipeable.defaultProps = {
  flickThreshold: 0.6,
  delta: 10,
  preventDefaultTouchmoveEvent: false,
  stopPropagation: false,
  nodeName: 'div',
  disabled: false,
  rotationAngle: 0,
};

module.exports = Swipeable;
