# Swipeable

## Install

    npm install react-swipeable

## Use

    var Swipeable = require('react-swipeable')

    var SampleComponent = React.createClass({
      render: function () {
        return (
          <Swipeable
            onSwipingUp={this.swipingUp}
            onSwipingRight={this.swipingRight}
            onSwipingDown={this.swipingDown}
            onSwipingLeft={this.swipingLeft}
            onSwiped={this.handleSwipeAction}>
            <div>
              This element can be swiped
            </div>
          </Swipeable>
        )
      }
    })

# Props

None of the props are required.
`onSwipingUp`, `onSwipingRight`, `onSwipingDown`, `onSwipingLeft` calls back with the event
as well as the absolute delta of where the swipe started and where it's currently at.

`onSwiped` calls back with the event, the X and Y delta, and whether or not the event was a flick `this.props.onSwiped(ev, x, y, isFlick)`

`flickThreshold` is a number (float) which determines the max velocity of a swipe before it's considered a flick.

`delta` is the amount of px before we start firing events. The default value is 10.

    onFlick: React.PropTypes.func,
    onSwiped: React.PropTypes.func,
    onSwipingUp: React.PropTypes.func,
    onSwipingRight: React.PropTypes.func,
    onSwipingDown: React.PropTypes.func,
    onSwipingLeft: React.PropTypes.func,
    flickThreshold: React.PropTypes.number,
    delta: React.PropTypes.number

# License

MIT
