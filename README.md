# Swipeable [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable)
React swipe component - Swipe bindings for react

[Demo](http://dogfessional.github.io/react-swipeable/)

### Install
Using npm:
```console
$ npm install --save react-swipeable
```

### Use

react-swipeable generates a React component (defaults to `<div>`) and binds touch events to it.

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
        onSwiped={this.swiped}
        onSwipedUp={this.swipedUp}
        onSwipedRight={this.swipedRight}
        onSwipedDown={this.swipedDown}
        onSwipedLeft={this.swipedLeft}
        onTap={this.tapped} >
          You can swipe here!
      </Swipeable>
    )
  }
})
```

## Event Props

**`onSwiping`**, **`onSwipingUp`**, **`onSwipingRight`**, **`onSwipingDown`**, **`onSwipingLeft`**, are called with the event
as well as the absolute delta of where the swipe started and where it's currently at. These constantly fire throughout touch events.

**`onSwiping`** in addition to the swipe delta, `onSwiping` also returns the current absolute X and Y position, as well as the current velocity of the swipe. `this.props.onSwiping(e, deltaX, deltaY, absX, absY, velocity)`

**`onSwipedUp`**, **`onSwipedRight`**, **`onSwipedDown`**, **`onSwipedLeft`** are called with the event
as well as the x distance, + or -, from where the swipe started to where it ended. These only fire at the end of a touch event.

**`onSwiped`** is called with the event, the X and Y delta, whether or not the event was a flick, and the current velocity of the swipe. `this.props.onSwiped(e, x, y, isFlick, velocity)`

**`onTap`** is called with the onTouchEnd event when the element has been tapped. `this.props.onTap(e)`

#####Configuration Props

**`flickThreshold`** is a number (float) which determines the max velocity of a swipe before it's considered a flick. The default value is `0.6`.

**`delta`** is the amount of px before we start firing events. Also affects how far `onSwipedUp`, `onSwipedRight`, `onSwipedDown`, and `onSwipedLeft` need to be before they fire events. The default value is `10`.

**`preventDefaultTouchmoveEvent`** is whether to prevent the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event.  Sometimes you would like the target to scroll natively.  The default value is `true`.

**`stopPropagation`** automatically calls stopPropagation on all 'swipe' events. The default value is `false`.

**`nodeName`** is a string which determines the html element/node that this react component binds its touch events to then returns. The default value is `'div'`.

**`trackMouse`** will allow mouse 'swipes' to be tracked(click, hold, move, let go). See [#51](https://github.com/dogfessional/react-swipeable/issues/51) for more details. The default value is `false`.

**None of the props are required.**
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
  onTap: React.PropTypes.func,
  flickThreshold: React.PropTypes.number,
  delta: React.PropTypes.number,
  preventDefaultTouchmoveEvent: React.PropTypes.bool,
  stopPropagation: React.PropTypes.bool,
  nodeName: React.PropTypes.string
  trackMouse: React.PropTypes.bool,
```

## Development

Initial set up, run `npm install`.

Make changes/updates to the `src/Swipeable.js` file.

Before creating a PR please run `npm test` to make sure the tests and lint pass. Add tests if PR adds functionality please.

#### Test changes/updates with the examples

cd into `examples` directory, then `npm install` within that directory, and finally `npm start`.

After the server starts you can then view the examples page with your changes at `http://localhost:3000`.

You can now make updates/changes to `src/Swipeable.js` and webpack will rebuild, then reload the page so you can test your changes!

## License

MIT
