import React, {Component} from 'react';
import Swipeable from '../../lib/Swipeable';

const DIRECTIONS = ['Left', 'Right', 'Up', 'Down'];

const initialState = {
  swiping: false,
  swiped: false,
  swipingDirection: '',
  swipedDirection: '',
};
const initialStateSwipeable = {
  flickThreshold: '0.6',
  delta: '10',
  preventDefaultTouchmoveEvent: true,
  stopPropagation: false,
  nodeName: 'div',
};
const initialStateApplied = {
  onSwipingApplied: true,
  onSwipedApplied: true,
  onSwipingLeftApplied: true,
  onSwipingRightApplied: true,
  onSwipingUpApplied: true,
  onSwipingDownApplied: true,
  onSwipedLeftApplied: true,
  onSwipedRightApplied: true,
  onSwipedUpApplied: true,
  onSwipedDownApplied: true,
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState, initialStateSwipeable, initialStateApplied);
  }

  resetState(resetAll) {
    if (resetAll) {
      this.setState(Object.assign({}, initialState, initialStateSwipeable, initialStateApplied));
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

  _renderAppliedDirRow(dir) {
    return (
      <tr key={`appliedDirRow${dir}`}>
        <td className="text-center">
          <input type="checkbox" checked={this.state[`onSwiping${dir}Applied`]}
            onChange={(e)=>this.updateValue(`onSwiping${dir}Applied`, e.target.checked)} />
        </td>
        <td style={{color: this.state[`onSwiping${dir}Applied`] ? '#000000' : '#cccccc', borderRight: "1px solid #cccccc"}}>{dir}</td>
        <td className="text-center">
          <input type="checkbox" checked={this.state[`onSwiped${dir}Applied`]}
            onChange={(e)=>this.updateValue(`onSwiped${dir}Applied`, e.target.checked)} />
        </td>
        <td style={{color: this.state[`onSwiped${dir}Applied`] ? '#000000' : '#cccccc'}}>{dir}</td>
      </tr>
    )
  }

  render() {
    const {
      swiping,
      swiped,
      swipingDirection,
      swipedDirection,
      flickThreshold,
      delta,
      onSwipingApplied,
      onSwipedApplied,
      preventDefaultTouchmoveEvent,
      stopPropagation,
      nodeName,
    } = this.state;

    const isFlickThresholdNumber = !(isNaN(flickThreshold) || flickThreshold === '');
    const isDeltaNumber = !(isNaN(delta) || delta === '');
    const flickThresholdNum = isFlickThresholdNumber ? +flickThreshold : 0.6;
    const deltaNum = isDeltaNumber ? +delta : 10;

    const boundSwipes = getBoundSwipes(this);
    let swipeableDirProps = {};
    if (onSwipingApplied) {
      swipeableDirProps.onSwiping = (...args)=>this.onSwiping(...args);
    }
    if (onSwipedApplied) {
      swipeableDirProps.onSwiped = (...args)=>this.onSwiped(...args);
    }

    return (
      <div className="row">
        <div className="medium-6 column">
          <h1>react-swipeable&nbsp;<a href="https://github.com/dogfessional/react-swipeable" style={{fontSize: "0.75rem"}}>View on GitHub</a></h1>
          <Swipeable {...boundSwipes}
            {...swipeableDirProps}
            flickThreshold={flickThresholdNum}
            delta={deltaNum}
            preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
            stopPropagation={stopPropagation}
            nodeName={nodeName}
            className="callout"
            style={{fontSize: "0.75rem"}}>
              <div onTouchStart={()=>this.resetState()}>
                <h5>Swipe inside here to test...</h5>
                <p>See output below and check the console for 'onSwiping' and 'onSwiped' callback output</p>
                <span>You can also 'toggle' the swip(ed/ing) props being applied to this container below.</span>
              </div>
          </Swipeable>
          <table>
            <thead>
              <tr><th>Applied?</th><th>Action</th><th>Output</th></tr>
            </thead>
            <tbody>
              <tr style={{color: onSwipingApplied ? '#000000' : '#cccccc'}}>
                <td className="text-center">
                  <input type="checkbox" checked={onSwipingApplied}
                    onChange={(e)=>this.updateValue('onSwipingApplied', e.target.checked)} />
                </td>
                <td>onSwiping</td><td>{swiping ? 'True' : 'False'}</td>
              </tr>
              <tr style={{color: onSwipedApplied ? '#000000' : '#cccccc'}}>
                <td className="text-center">
                  <input type="checkbox" checked={onSwipedApplied}
                    onChange={(e)=>this.updateValue('onSwipedApplied', e.target.checked)} />
                </td>
                <td>onSwiped</td><td>{swiped ? 'True' : 'False'}</td>
              </tr>
              <tr>
                <td className="text-center"><a href="#appliedDirs">↓&nbsp;Below&nbsp;↓</a></td>
                <td>onSwiping[Direction]</td><td>{swipingDirection}</td>
              </tr>
              <tr>
                <td className="text-center"><a href="#appliedDirs">↓&nbsp;Below&nbsp;↓</a></td>
                <td>onSwiped[Direction]</td><td>{swipedDirection}</td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">delta:</td>
                <td>
                  <input type="text"
                    style={{margin: '0px', border: !isDeltaNumber ? '2px solid red' : ''}}
                    onChange={(e)=>this.updateValue('delta', getVal(e))} value={delta}/>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">flickThreshold:</td>
                <td>
                  <input type="text"
                    style={{margin: '0px', border: !isFlickThresholdNumber ? '2px solid red' : ''}}
                    onChange={(e)=>this.updateValue('flickThreshold', getVal(e))} value={flickThreshold}/>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">preventDefaultTouchmoveEvent:</td>
                <td>
                  <input
                    type="checkbox"
                    checked={preventDefaultTouchmoveEvent}
                    onChange={(e)=>this.updateValue('preventDefaultTouchmoveEvent', e.target.checked)}/>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">stopPropagation:</td>
                <td>
                  <input
                    type="checkbox"
                    checked={stopPropagation}
                    onChange={(e)=>this.updateValue('stopPropagation', e.target.checked)}/>
                </td>
              </tr>
              <tr>
                <td className="text-center">nodeName:</td>
                <td colSpan="2" className="text-center">
                    <button type="button" className={`button${nodeName!=='div'?' secondary':''}`}
                      style={{margin: '.5rem'}}
                      onClick={()=>this.updateValue('nodeName', 'div')}>{`'div'`}</button>
                    <button type="button" className={`button${nodeName!=='span'?' secondary':''}`}
                      style={{margin: '.5rem'}}
                      onClick={()=>this.updateValue('nodeName', 'span')}>{`'span'`}</button>
                    <button type="button" className={`button${nodeName!=='li'?' secondary':''}`}
                      style={{margin: '.5rem'}}
                      onClick={()=>this.updateValue('nodeName', 'li')}>{`'li'`}</button>
                </td>
              </tr>
            </tbody>
          </table>
          <table id="appliedDirs">
            <thead>
              <tr><th colSpan="2" className="text-center" style={{borderRight: "1px solid #cccccc"}}>onSwiping</th><th colSpan="2" className="text-center">onSwiped</th></tr>
              <tr><th>Applied?</th><th style={{borderRight: "1px solid #cccccc"}}>Direction</th><th>Applied?</th><th>Direction</th></tr>
            </thead>
            <tbody>
              {DIRECTIONS.map(this._renderAppliedDirRow.bind(this))}
            </tbody>
          </table>
          <button type="button" className="tiny button expanded" onClick={()=>this.resetState(true)}>Reset All Options</button>
          <p style={{"marginBottom": "5rem"}}>
            Thanks for checking out the example app! Let us know if you find any bugs, and&nbsp;
            <a href="https://github.com/dogfessional/react-swipeable/pulls">submit a PR!</a>
          </p>
        </div>
      </div>
    )
  }
}

function getBoundSwipes(component) {
  let boundSwipes = {};
  DIRECTIONS.forEach((dir)=>{
    if (component.state[`onSwiped${dir}Applied`]) {
      boundSwipes[`onSwiped${dir}`] = component.onSwipedDirection.bind(component, dir);
    }
    if (component.state[`onSwiping${dir}Applied`]) {
      boundSwipes[`onSwiping${dir}`] = component.onSwipingDirection.bind(component, dir);
    }
  });
  return boundSwipes;
}

function getVal(e) {
  return e.target.value;
}
