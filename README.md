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

`onSwiped` calls back with the event and the X and Y delta.

`onFlick` is called only if a flick is detected with the event and the X and Y delta.

`delta` is the amount of px before we start firing events. The default value is 10.

    onFlick: React.PropTypes.func,
    onSwiped: React.PropTypes.func,
    onSwipingUp: React.PropTypes.func,
    onSwipingRight: React.PropTypes.func,
    onSwipingDown: React.PropTypes.func,
    onSwipingLeft: React.PropTypes.func,
    delta: React.PropTypes.number

# License

MIT
