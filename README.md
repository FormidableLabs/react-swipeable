# Swipeable

## Install

```console
$ npm install react-swipeable
```

## Use

```js
var Swipeable = require('react-swipeable')

var SampleComponent = React.createClass({
  render: function () {
    return (
      <Swipeable
        onSwiping={this.swiping}
        onSwipingUp={this.swipingUp}
        onSwipingRight={this.swipingRight}
        onSwipingDown={this.swipingDown}
        onSwipingLeft={this.swipingLeft}
        onSwipedUp={this.swipedUp}
        onSwipedRight={this.swipedRight}
        onSwipedDown={this.swipedDown}
        onSwipedLeft={this.swipedLeft}
        onSwiped={this.handleSwipeAction}>
        <div>
          This element can be swiped
        </div>
      </Swipeable>
    )
  }
})
```

# Props

**None of the props are required.**
`onSwiping`, `onSwipingUp`, `onSwipingRight`, `onSwipingDown`, `onSwipingLeft`, calls back with the event
as well as the absolute delta of where the swipe started and where it's currently at. These constantly fire throughout touch events.

`onSwipedUp`, `onSwipedRight`, `onSwipedDown`, `onSwipedLeft` calls back with the event
as well as the x distance, + or -, from where the swipe started to where it ended. These only fire at the end of a touch event.

`onSwiped` calls back with the event, the X and Y delta, and whether or not the event was a flick `this.props.onSwiped(ev, x, y, isFlick)`

`flickThreshold` is a number (float) which determines the max velocity of a swipe before it's considered a flick.

`delta` is the amount of px before we start firing events. Also effects how far `onSwipedUp`, `onSwipedRight`, `onSwipedDown`, and `onSwipedLeft` need to be before they fire events. The default value is 10.

### PropTypes

```
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
  delta: React.PropTypes.number
```

## Development

Initial set up, run:

```console
$ npm install
```

For watch on files and JSX transpiling, run:

```console
$ gulp
```
    
#####Please make updates and changes to the `jsx/Swipeable.jsx`, and have gulp/babel compile the `js/Swipeable.js` file.

# License

MIT
