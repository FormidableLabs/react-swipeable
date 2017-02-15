const React = require('react');

function getInitialState() {
  return {
    x: null,
    y: null,
    swiping: false,
    start: 0,
  };
}

const Swipeable = React.createClass({
  propTypes: {
    onSwiped: React.PropTypes.func,
    onSwiping: React.PropTypes.func,
    onSwipingUp: React.PropTypes.func,
    onSwipingRight: React.PropTypes.func,
    onSwipingDown: React.PropTypes.func,
    onSwipingLeft: React.PropTypes.func,
    onSwipedUp: React.PropTypes.func,
    onSwipedRight: React.PropTypes.func,
    onSwipedDown: React.PropTypes.func,
    onSwipedLeft: React.PropTypes.func,
    onTap: React.PropTypes.func,
    flickThreshold: React.PropTypes.number,
    delta: React.PropTypes.number,
    preventDefaultTouchmoveEvent: React.PropTypes.bool,
    stopPropagation: React.PropTypes.bool,
    nodeName: React.PropTypes.string,
    trackMouse: React.PropTypes.bool,
    children: React.PropTypes.node,
  },

  getDefaultProps() {
    return {
      flickThreshold: 0.6,
      delta: 10,
      preventDefaultTouchmoveEvent: true,
      stopPropagation: false,
      nodeName: 'div',
    };
  },

  componentWillMount() {
    this.swipeable = getInitialState();
  },

  calculatePos(e) {
    let x;
    let y;
    // If not a touch, determine point from mouse coordinates
    if (e.changedTouches) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const xd = this.swipeable.x - x;
    const yd = this.swipeable.y - y;

    const axd = Math.abs(xd);
    const ayd = Math.abs(yd);

    const time = Date.now() - this.swipeable.start;
    const velocity = Math.sqrt(axd * axd + ayd * ayd) / time;

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd,
      velocity,
    };
  },

  eventStart(e) {
    if (typeof this.props.onMouseDown === 'function') { // eslint-disable-line react/prop-types
      this.props.onMouseDown(e); // eslint-disable-line react/prop-types
    }

    if (e.type === 'mousedown' && !this.props.trackMouse) {
      return;
    }

    if (e.touches && e.touches.length > 1) {
      return;
    }
    // If not a touch, determine point from mouse coordinates
    let touches = e.touches;
    if (!touches) {
      touches = [{ clientX: e.clientX, clientY: e.clientY }];
    }
    if (this.props.stopPropagation) e.stopPropagation();

    this.swipeable = {
      start: Date.now(),
      x: touches[0].clientX,
      y: touches[0].clientY,
      swiping: false,
    };
  },

  eventMove(e) {
    if (typeof this.props.onMouseMove === 'function') { // eslint-disable-line react/prop-types
      this.props.onMouseMove(e); // eslint-disable-line react/prop-types
    }

    if (e.type === 'mousemove' && !this.props.trackMouse) {
      return;
    }

    if (!this.swipeable.x || !this.swipeable.y || e.touches && e.touches.length > 1) {
      return;
    }

    let cancelPageSwipe = false;
    const pos = this.calculatePos(e);

    if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
      return;
    }

    if (this.props.stopPropagation) e.stopPropagation();

    if (this.props.onSwiping) {
      this.props.onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY, pos.velocity);
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (this.props.onSwipingLeft || this.props.onSwipedLeft) {
          this.props.onSwipingLeft && this.props.onSwipingLeft(e, pos.absX);
          cancelPageSwipe = true;
        }
      } else if (this.props.onSwipingRight || this.props.onSwipedRight) {
        this.props.onSwipingRight && this.props.onSwipingRight(e, pos.absX);
        cancelPageSwipe = true;
      }
    } else if (pos.deltaY > 0) {
      if (this.props.onSwipingUp || this.props.onSwipedUp) {
        this.props.onSwipingUp && this.props.onSwipingUp(e, pos.absY);
        cancelPageSwipe = true;
      }
    } else if (this.props.onSwipingDown || this.props.onSwipedDown) {
      this.props.onSwipingDown && this.props.onSwipingDown(e, pos.absY);
      cancelPageSwipe = true;
    }

    this.swipeable.swiping = true;

    if (cancelPageSwipe && this.props.preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  },

  eventEnd(e) {
    if (typeof this.props.onMouseUp === 'function') { // eslint-disable-line react/prop-types
      this.props.onMouseUp(e); // eslint-disable-line react/prop-types
    }

    if (e.type === 'mouseup' && !this.props.trackMouse) {
      return;
    }

    if (this.swipeable.swiping) {
      const pos = this.calculatePos(e);

      if (this.props.stopPropagation) e.stopPropagation();

      const isFlick = pos.velocity > this.props.flickThreshold;

      this.props.onSwiped && this.props.onSwiped(
        e,
        pos.deltaX,
        pos.deltaY,
        isFlick,
        pos.velocity,
      );

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          this.props.onSwipedLeft && this.props.onSwipedLeft(e, pos.deltaX, isFlick);
        } else {
          this.props.onSwipedRight && this.props.onSwipedRight(e, pos.deltaX, isFlick);
        }
      } else if (pos.deltaY > 0) {
        this.props.onSwipedUp && this.props.onSwipedUp(e, pos.deltaY, isFlick);
      } else {
        this.props.onSwipedDown && this.props.onSwipedDown(e, pos.deltaY, isFlick);
      }
    } else {
      this.props.onTap && this.props.onTap(e);
    }

    this.swipeable = getInitialState();
  },

  render() {
    const newProps = {
      ...this.props,
      onTouchStart: this.eventStart,
      onTouchMove: this.eventMove,
      onTouchEnd: this.eventEnd,
      onMouseDown: this.eventStart,
      onMouseMove: this.eventMove,
      onMouseUp: this.eventEnd,
    };

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

    return React.createElement(
      this.props.nodeName,
      newProps,
      this.props.children,
    );
  },
});

module.exports = Swipeable;
