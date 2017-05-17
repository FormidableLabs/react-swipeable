# Swipeable [![npm version](https://img.shields.io/npm/v/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable) [![npm downloads](https://img.shields.io/npm/dm/react-swipeable.svg?style=flat-square)](https://www.npmjs.com/package/react-swipeable)
React swipe component - Swipe bindings for react

[Demo](http://dogfessional.github.io/react-swipeable/)

### Install
```console
$ npm install --save react-swipeable
```

### Use

```js
import Swipeable from 'react-swipeable'

class SwipeComponent extends React.Component {

  swiping(e, deltaX, deltaY, absX, absY, velocity) {
    console.log('Swiping...', e, deltaX, deltaY, absX, absY, velocity)
  }

  swiped(e, deltaX, deltaY, isFlick, velocity) {
    console.log('Swiped...', e, deltaX, deltaY, isFlick, velocity)
  }

  render() {
    return (
      <Swipeable
        onSwiping={this.swiping}
        onSwiped={this.swiped} >
          You can swipe here!
      </Swipeable>
    )
  }
}
```
react-swipeable generates a React element(`<div>` by default) under the hood and binds touch events to it which in turn are used to fire the `swiped` and `swiping` props.

## Props / Config Options

### Event Props

**`onSwiping`**, **`onSwipingUp`**, **`onSwipingRight`**, **`onSwipingDown`**, **`onSwipingLeft`**, are called with the event
as well as the absolute delta of where the swipe started and where it's currently at. These constantly fire throughout touch events.

**`onSwiping`** in addition to the swipe delta, `onSwiping` also returns the current absolute X and Y position, as well as the current velocity of the swipe. `this.props.onSwiping(e, deltaX, deltaY, absX, absY, velocity)`

**`onSwipedUp`**, **`onSwipedRight`**, **`onSwipedDown`**, **`onSwipedLeft`** are called with the event
as well as the x distance, + or -, from where the swipe started to where it ended. These only fire at the end of a touch event.

**`onSwiped`** is called with the event, the X and Y delta, whether or not the event was a flick, and the current velocity of the swipe. `this.props.onSwiped(e, x, y, isFlick, velocity)`

**`onTap`** is called with the onTouchEnd event when the element has been tapped. `this.props.onTap(e)`

### Configuration Props

**`flickThreshold`** is a number (float) which determines the max velocity of a swipe before it's considered a flick. The default value is `0.6`.

**`delta`** is the amount of px before we start firing events. Also affects how far `onSwipedUp`, `onSwipedRight`, `onSwipedDown`, and `onSwipedLeft` need to be before they fire events. The default value is `10`.

**`preventDefaultTouchmoveEvent`** is whether to prevent the browser's [touchmove](https://developer.mozilla.org/en-US/docs/Web/Events/touchmove) event.  Sometimes you would like the target to scroll natively.  The default value is `false`. [Chrome 56 and later, warning with preventDefault](#chrome-56-and-later-warning-with-preventdefault)
 * **Notes** `e.preventDefault()` is only called when `preventDefaultTouchmoveEvent` is `true` **and** the user is swiping in a direction that has an associated directional `onSwiping` or `onSwiped` prop.
   * Example: user is swiping right with `<Swipable onSwipedRight={this.userSwipedRight} preventDefaultTouchmoveEvent={true} >` then `e.preventDefault()` will be called, but if user was swiping left `e.preventDefault()` would **not** be called.
   * Please experiment with [example](http://dogfessional.github.io/react-swipeable/) to test `preventDefaultTouchmoveEvent`.

**`stopPropagation`** automatically calls stopPropagation on all 'swipe' events. The default value is `false`.

**`nodeName`** is a string which determines the html element/node that this react component binds its touch events to then returns. The default value is `'div'`.

**`trackMouse`** will allow mouse 'swipes' to be tracked(click, hold, move, let go). See [#51](https://github.com/dogfessional/react-swipeable/issues/51) for more details. The default value is `false`.

**None of the props are required.**
### PropType Definitions

#### Event Props:
```
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
```
#### Config Props:
```
  flickThreshold: PropTypes.number, // default: 0.6
  delta: PropTypes.number, // default: 10
  preventDefaultTouchmoveEvent: PropTypes.bool, // default: false
  stopPropagation: PropTypes.bool, // default: false
  nodeName: PropTypes.string // default: div
  trackMouse: PropTypes.bool, // default: false
```

### Chrome 56 and later, warning with preventDefault
When this library tries to call `e.preventDefault()` in Chrome 56+ a warning is logged:
`Unable to preventDefault inside passive event listener due to target being treated as passive.`

This warning is because this [change](https://developers.google.com/web/updates/2017/01/scrolling-intervention) to Chrome 56+ and the way the synthetic events are setup in reactjs.

If you'd like to prevent all scrolling/zooming within a `<Swipeable />` component you can pass a `touchAction` style property equal to `'none'`, [example](https://github.com/dogfessional/react-swipeable/blob/master/examples/app/Main.js#L143). Chrome's recommendation for  [reference](https://developers.google.com/web/updates/2017/01/scrolling-intervention).

```
<Swipeable style={{touchAction: 'none'}} />
```

Follow reacts handling of this issue here: [facebook/react#8968](https://github.com/facebook/react/issues/8968)

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
