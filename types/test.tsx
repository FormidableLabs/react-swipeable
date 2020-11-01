import * as React from 'react'
import { Swipeable, SwipeableHandlers, SwipeableProps, SwipeCallback, useSwipeable } from 'react-swipeable'

class SampleComponent extends React.PureComponent<SwipeableProps> {
  private readonly handleSwiped: SwipeCallback = () => {}
  private readonly handleSwipedLeft: SwipeCallback = () => {}
  private readonly handleSwipedRight: SwipeCallback = () => {}
  private readonly handleSwipedUp: SwipeCallback = () => {}
  private readonly handleSwipedDown: SwipeCallback = () => {}
  private readonly handleSwiping: SwipeCallback = () => {}

  render() {
    return (
      <Swipeable
        // Event handler/callbacks
        onSwiped={this.handleSwiped}
        onSwipedLeft={this.handleSwipedLeft}
        onSwipedRight={this.handleSwipedRight}
        onSwipedUp={this.handleSwipedUp}
        onSwipedDown={this.handleSwipedDown}
        onSwiping={this.handleSwiping}

        // Configuration Props
        delta={10}
        preventDefaultTouchmoveEvent={true}
        trackTouch={true}
        trackMouse={true}
        rotationAngle={10}

        // Component Specific Props
        nodeName="div"
        innerRef={() => {}}
        style={{ backgroundColor: 'blue' }}
        className="classname"
        aria-hidden={false}
      >
        <div>This element can be swiped</div>
      </Swipeable>
    )
  }
}

class SwipeableDiv extends Swipeable {}

const TestComponent: React.FunctionComponent = _ => {
  const handleSwiped: SwipeCallback = () => {}

  return (
    <SwipeableDiv nodeName="div" onSwiped={handleSwiped}>
      <div>this is sample code.</div>
    </SwipeableDiv>
  )
}

const TestHook = () => {
  const [swipeDir, setDir] = React.useState('');
  const handlers = useSwipeable({ onSwiped: ({ dir }) => setDir(dir) })
  return <div {...handlers} >{swipeDir}</div>
}

const handlers: SwipeableHandlers = useSwipeable({
  onSwipedLeft: (data) => {
    // verify EventData properties
    const {
      event, // $ExpectType MouseEvent | TouchEvent
      deltaX, // $ExpectType number
      deltaY, // $ExpectType number
      absX, // $ExpectType number
      absY, // $ExpectType number
      first, // $ExpectType boolean
      initial: [
        initialX, // $ExpectType number
        initialY // $ExpectType number
      ],
      velocity, // $ExpectType number
      dir, // $ExpectType "Left" | "Right" | "Up" | "Down"
      ...rest // $ExpectType {}
    } = data;
  },
  preventDefaultTouchmoveEvent: true,
  trackTouch: true,
})

handlers.ref(<div />)
handlers.ref(null)
