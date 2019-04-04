// tslint:disable no-useless-files
/**
 * This test should be run with dtslint, however as of dtslint@0.6.0 dtslint is
 * running tests files in node_modules, which of course failed.
 *
 * To attempt testing again:
 *   1. Uncomment this file
 *   2. Run: 'npm install -D dtslint @types/react'
 *   3. Add 'dtslint": "dtslint types"' to scripts in package.json
 *   4. Run: 'npm run dtslint'
 */

// import * as React from 'react'
// import { Swipeable, SwipeableProps, SwipeCallback } from 'react-swipeable'

// class SampleComponent extends React.PureComponent<SwipeableProps> {
//   private readonly handleSwiped: SwipeCallback = () => {}
//   private readonly handleSwipedLeft: SwipeCallback = () => {}
//   private readonly handleSwipedRight: SwipeCallback = () => {}
//   private readonly handleSwipedUp: SwipeCallback = () => {}
//   private readonly handleSwipedDown: SwipeCallback = () => {}
//   private readonly handleSwiping: SwipeCallback = () => {}

//   render() {
//     return (
//       <Swipeable
//         // Event handler/callbacks
//         onSwiped={this.handleSwiped}
//         onSwipedLeft={this.handleSwipedLeft}
//         onSwipedRight={this.handleSwipedRight}
//         onSwipedUp={this.handleSwipedUp}
//         onSwipedDown={this.handleSwipedDown}
//         onSwiping={this.handleSwiping}

//         // Configuration Props
//         delta={10}
//         preventDefaultTouchmoveEvent={true}
//         trackTouch={true}
//         trackMouse={true}
//         rotationAngle={10}

//         // Component Specific Props
//         nodeName="div"
//         innerRef={() => {}}
//         style={{ backgroundColor: 'blue' }}
//         className="classname"
//       >
//         <div>This element can be swiped</div>
//       </Swipeable>
//     )
//   }
// }

// class SwipeableDiv extends Swipeable {}

// const TestComponent: React.StatelessComponent = _ => {
//   const handleSwiped: SwipeCallback = () => {}

//   return (
//     <SwipeableDiv nodeName="div" onSwiped={handleSwiped}>
//       <div>this is sample code.</div>
//     </SwipeableDiv>
//   )
// }
