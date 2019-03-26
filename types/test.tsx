import * as React from 'react'
import { ReactSwipeable, Swipeable } from 'react-swipeable'

class SampleComponent extends React.PureComponent<ReactSwipeable.SwipeableProps> {
  private readonly handleSwiped: ReactSwipeable.SwipedCallback = () => {}
  private readonly handleSwipedLeft: ReactSwipeable.SwipedCallback = () => {}
  private readonly handleSwipedRight: ReactSwipeable.SwipedCallback = () => {}
  private readonly handleSwipedUp: ReactSwipeable.SwipedCallback = () => {}
  private readonly handleSwipedDown: ReactSwipeable.SwipedCallback = () => {}
  private readonly handleSwiping: ReactSwipeable.SwipedCallback = () => {}

  private readonly swipeRef = React.createRef<HTMLElement>()

  render() {
    return (
      <Swipeable
        // Event data
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
  const handleSwiped: ReactSwipeable.SwipedCallback = () => {}
  return (
    <SwipeableDiv nodeName="div" onSwiped={handleSwiped}>
      <div>this is sample code.</div>
    </SwipeableDiv>
  )
}
