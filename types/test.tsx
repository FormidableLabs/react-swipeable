import * as React from 'react'
import { Swipeable, SwipeableProps, SwipeCallback, useSwipeable } from 'react-swipeable'

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
      >
        <div>This element can be swiped</div>
      </Swipeable>
    )
  }
}

class SwipeableDiv extends Swipeable {}

const TestComponent: React.StatelessComponent = _ => {
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
