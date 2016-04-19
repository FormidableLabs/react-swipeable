import React, {Component} from 'react';
import Swipeable from '../../js/Swipeable';

const initialState = {
  swiping: false,
  swiped: false,
  swipingDirection: '',
  swipedDirection: ''
};
const initialStateSwipeable = {
  flickThreshold: '0.6',
  delta: '10',
  preventDefaultTouchmoveEvent: true
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState, initialStateSwipeable);
  }

  resetState(resetAll) {
    if (resetAll) {
      this.setState(Object.assign({}, initialState, initialStateSwipeable));
    } else {
      this.setState(initialState);
    }
  }

  onSwiped(...args) {
    console.log('swiped args: ', args)
    this.setState({
      swiped: true,
      swiping: false,
    });
  }

  onSwiping(...args) {
    console.log('swiping args: ', args)
    this.setState({
      swiping: true,
      swiped: false,
    });
  }

  onSwipedDirection(direction) {
    this.setState({
      swipedDirection: direction,
    });
  }

  onSwipingDirection(direction) {
    this.setState({
      swipingDirection: direction,
    });
  }

  updateValue(type, value) {
    this.setState({
      [type]: value,
    });
  }

  render() {
    const {
      swiping,
      swiped,
      swipingDirection,
      swipedDirection,
      flickThreshold,
      delta,
      preventDefaultTouchmoveEvent
    } = this.state;
    const boundSwipes = getBoundSwipes(this);
    const isFlickThresholdNumber = !(isNaN(flickThreshold) || flickThreshold === '');
    const isDeltaNumber = !(isNaN(delta) || delta === '');
    const flickThresholdNum = isFlickThresholdNumber ? +flickThreshold : 0.6;
    const deltaNum = isDeltaNumber ? +delta : 10;
    return (
      <div className="row">
        <div className="medium 6 columns">
          <div className="row">
            <div className="small-12 columns">
              <h1>react-swipeable</h1>
              <h5>Swipe bindings for react</h5>
              <a href="https://github.com/dogfessional/react-swipeable"> View on GitHub </a>
            </div>
          </div>

          <div className="row">
            <div className="small-12 columns">
              <Swipeable {...boundSwipes}
                onSwiping={(...args)=>this.onSwiping(...args)}
                onSwiped={(...args)=>this.onSwiped(...args)}
                flickThreshold={flickThresholdNum}
                delta={deltaNum}
                preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}>
                <div className="callout"
                  onTouchStart={()=>this.resetState()}
                  style={{height: '150px', overflowY: 'scroll'}}>
                  <h5>Swipe inside here...</h5>
                  <p>Here is some filler to make it scrollable...</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
              </Swipeable>
            </div>
          </div>

          <div className="row align-center">
            <table>
              <thead>
                <tr><th>Action</th><th>Output</th></tr>
              </thead>
              <tbody>
                <tr><td>onSwiping</td><td>{swiping ? 'True' : 'False'}</td></tr>
                <tr><td>onSwiped</td><td>{swiped ? 'True' : 'False'}</td></tr>
                <tr><td>onSwiping[Direction]</td><td>{swipingDirection}</td></tr>
                <tr><td>onSwiped[Direction]</td><td>{swipedDirection}</td></tr>
                <tr>
                  <td>delta:</td>
                  <td>
                    <input type="text"
                      style={{margin: '0px', border: !isDeltaNumber ? '2px solid red' : ''}}
                      onChange={(e)=>this.updateValue('delta', getVal(e))} value={delta}/>
                  </td>
                </tr>
                <tr>
                  <td>flickThreshold:</td>
                  <td>
                    <input type="text"
                      style={{margin: '0px', border: !isFlickThresholdNumber ? '2px solid red' : ''}}
                      onChange={(e)=>this.updateValue('flickThreshold', getVal(e))} value={flickThreshold}/>
                  </td>
                </tr>
                <tr>
                  <td>preventDefaultTouchmoveEvent:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={preventDefaultTouchmoveEvent}
                      onChange={(e)=>this.updateValue('preventDefaultTouchmoveEvent', e.target.checked)}/>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <button type="button" className="tiny button expanded" onClick={()=>this.resetState(true)}>Reset</button>
            </div>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <h5>You can also check the console log for 'onSwiping' and 'onSwiped' callback output</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function getBoundSwipes(component) {
  const directions = ['Left', 'Right', 'Up', 'Down'];
  let boundSwipes = {};
  directions.forEach((dir)=>{
    boundSwipes[`onSwiped${dir}`] = component.onSwipedDirection.bind(component, dir);
    boundSwipes[`onSwiping${dir}`] = component.onSwipingDirection.bind(component, dir);
  });
  return boundSwipes;
}

function getVal(e) {
  return e.target.value;
}
