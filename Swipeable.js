var React = require('react')

var FLICK_THRESHOLD = 0.5

var Swipeable = React.createClass({
  propTypes: {
    onSwiped: React.PropTypes.func,
    onFlick: React.PropTypes.func,
    onSwipingUp: React.PropTypes.func,
    onSwipingRight: React.PropTypes.func,
    onSwipingDown: React.PropTypes.func,
    onSwipingLeft: React.PropTypes.func,
    delta: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      x: null,
      y: null,
      swiping: false,
      start: 0
    }
  },

  getDefaultProps: function () {
    return {
      delta: 10
    }
  },

  calculatePos: function (e) {
    var x = e.changedTouches[0].clientX
    var y = e.changedTouches[0].clientY

    var xd = this.state.x - x
    var yd = this.state.y - y

    var axd = Math.abs(xd)
    var ayd = Math.abs(yd)

    return {
      deltaX: xd,
      deltaY: yd,
      absX: axd,
      absY: ayd
    }
  },

  touchStart: function (e) {
    if (e.touches.length > 1) {
      return
    }
    this.setState({
      start: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      swiping: false
    })
  },

  touchMove: function (e) {
    if (!this.state.x || !this.state.y || e.touches.length > 1) {
      return
    }

    var cancelPageSwipe = false
    var pos = this.calculatePos(e)

    if (pos.absX < this.props.delta && pos.absY < this.props.delta) {
      return
    }

    if (pos.absX > pos.absY) {
      if (pos.deltaX > 0) {
        if (this.props.onSwipingLeft) {
          this.props.onSwipingLeft(e, pos.absX)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingRight) {
          this.props.onSwipingRight(e, pos.absX)
          cancelPageSwipe = true
        }
      }
    } else {
      if (pos.deltaY < 0) {
        if (this.props.onSwipingUp) {
          this.props.onSwipingUp(e, pos.absY)
          cancelPageSwipe = true
        }
      } else {
        if (this.props.onSwipingDown) {
          this.props.onSwipingDown(e, pos.absY)
          cancelPageSwipe = true
        }
      }
    }

    this.setState({ swiping: true })

    if (cancelPageSwipe) {
      e.preventDefault()
    }
  },

  touchEnd: function (e) {
    if (this.state.swiping) {
      var pos = this.calculatePos(e)

      var time = Date.now() - this.state.start
      var distance = pos.absX + pos.absY
      var isFlick = (time / distance) < FLICK_THRESHOLD

      if (isFlick) {
        this.props.onFlick && this.props.onFlick(e, pos.deltaX, pos.deltaY)
      } else {
        this.props.onSwiped && this.props.onSwiped(e, pos.deltaX, pos.deltaY)
      }
    }
    this.setState(this.getInitialState())
  },

  render: function () {
    return this.transferPropsTo(React.DOM.div({
      onTouchStart: this.touchStart,
      onTouchMove: this.touchMove,
      onTouchEnd: this.touchEnd
    }, this.props.children))
  }
})

module.exports = Swipeable
