'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var Swipeable = React.createClass({
  displayName: 'Swipeable',

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
    flickThreshold: React.PropTypes.number,
    delta: React.PropTypes.number,
    preventDefaultTouchmoveEvent: React.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return {
      x: null,
      y: null,
      swiping: false,
      start: 0
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      flickThreshold: 0.6,
      delta: 10,
      preventDefaultTouchmoveEvent: true
    };
  },

  calculatePos: function calculatePos(e) {
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;

    var xd = this.state.x - x;
    var yd = this.state.y - y;

    var axd = Math.abs(xd);
    var ayd = Math.abs(yd);

    var time = Date.now() - this.state.start;
    var velocity = Math.sqrt(axd * axd + ayd * ayd) / time;

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd,
      velocity: velocity
    };
  },

  touchStart: function touchStart(e) {
    if (e.touches.length > 1) {
      return;
    }
    this.setState({
      start: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      swiping: false
    });
  },

  touchMove: function touchMove(e) {
    if (!this.state.x || !this.state.y || e.touches.length > 1) {
      return;
    }

    var cancelPageSwipe = false;
    var pos = this.calculatePos(e);

    if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
      return;
    }

    if (this.props.onSwiping) {
      this.props.onSwiping(e, pos.deltaX, pos.deltaY, pos.absX, pos.absY, pos.velocity);
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (this.props.onSwipingLeft) {
          this.props.onSwipingLeft(e, pos.absX);
          cancelPageSwipe = true;
        }
      } else {
        if (this.props.onSwipingRight) {
          this.props.onSwipingRight(e, pos.absX);
          cancelPageSwipe = true;
        }
      }
    } else {
      if (pos.deltaY > 0) {
        if (this.props.onSwipingUp) {
          this.props.onSwipingUp(e, pos.absY);
          cancelPageSwipe = true;
        }
      } else {
        if (this.props.onSwipingDown) {
          this.props.onSwipingDown(e, pos.absY);
          cancelPageSwipe = true;
        }
      }
    }

    this.setState({ swiping: true });

    if (cancelPageSwipe && this.props.preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  },

  touchEnd: function touchEnd(ev) {
    if (this.state.swiping) {
      var pos = this.calculatePos(ev);

      var isFlick = pos.velocity > this.props.flickThreshold;

      this.props.onSwiped && this.props.onSwiped(ev, pos.deltaX, pos.deltaY, isFlick);

      if (pos.absX > pos.absY) {
        if (pos.deltaX > 0) {
          this.props.onSwipedLeft && this.props.onSwipedLeft(ev, pos.deltaX, isFlick);
        } else {
          this.props.onSwipedRight && this.props.onSwipedRight(ev, pos.deltaX, isFlick);
        }
      } else {
        if (pos.deltaY > 0) {
          this.props.onSwipedUp && this.props.onSwipedUp(ev, pos.deltaY, isFlick);
        } else {
          this.props.onSwipedDown && this.props.onSwipedDown(ev, pos.deltaY, isFlick);
        }
      }
    }

    this.setState(this.getInitialState());
  },

  render: function render() {
    return React.createElement(
      'div',
      _extends({}, this.props, {
        onTouchStart: this.touchStart,
        onTouchMove: this.touchMove,
        onTouchEnd: this.touchEnd }),
      this.props.children
    );
  }
});

module.exports = Swipeable;