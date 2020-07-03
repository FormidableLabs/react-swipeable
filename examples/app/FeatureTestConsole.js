import React, {Component} from 'react';
import { Swipeable } from '../../src/index.js';
import { RowSimpleCheckbox } from './TableComponents.js';
import SwipeableHook from './SwipeableHook.js';

const DIRECTIONS = ['Left', 'Right', 'Up', 'Down'];

const persistSyntheticEvent = (func, persist) => {
  return (e, ...rest) => {
    if (persist && e.persist) e.persist();
    return func(e, ...rest);
  }
}

const initialState = {
  swiping: false,
  swiped: false,
  tap: false,
  swipingDirection: '',
  swipedDirection: '',
};
const initialStateSwipeable = {
  delta: '10',
  preventDefaultTouchmoveEvent: false,
  trackMouse: false,
  trackTouch: true,
  rotationAngle: 0,
};
const initialStateApplied = {
  showOnSwipeds: false,
  onSwipingApplied: true,
  onSwipedApplied: true,
  onSwipedLeftApplied: true,
  onSwipedRightApplied: true,
  onSwipedUpApplied: true,
  onSwipedDownApplied: true,
  persistEvent: true,
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState, initialStateSwipeable, initialStateApplied);
    this.updateValue = this.updateValue.bind(this);
  }

  resetState(resetAll) {
    if (resetAll) {
      this.setState(Object.assign({}, initialState, initialStateSwipeable, initialStateApplied));
    } else {
      this.setState(initialState);
    }
  }

  onSwiped(args) {
    console.log('swiped args: ', args)
    this.setState({
      swiped: true,
      swiping: false,
    });
  }

  onSwiping(args) {
    console.log('swiping args: ', args)

    this.setState({
      swiping: true,
      swiped: false,
      swipingDirection: args.dir,
    });
  }

  onSwipedDirection(direction) {
    this.setState({
      swipedDirection: direction,
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
          <input type="checkbox" style={{margin: "0"}} checked={this.state[`onSwiped${dir}Applied`]}
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
      delta,
      showOnSwipeds,
      onSwipingApplied,
      onSwipedApplied,
      persistEvent,
      preventDefaultTouchmoveEvent,
      trackTouch,
      trackMouse,
      rotationAngle,
    } = this.state;

    const isDeltaNumber = !(isNaN(delta) || delta === '');
    const isRotationAngleNumber = !(isNaN(rotationAngle) || rotationAngle === '');
    const deltaNum = isDeltaNumber ? +delta : 10;
    const rotationAngleNum = isRotationAngleNumber ? +rotationAngle : 0;

    const swipeableStyle = {fontSize: "0.75rem"};

    const boundSwipes = getBoundSwipes(this);
    let swipeableDirProps = {};
    if (onSwipingApplied) {
      swipeableDirProps.onSwiping = persistSyntheticEvent((...args)=>this.onSwiping(...args), persistEvent);
    }
    if (onSwipedApplied) {
      swipeableDirProps.onSwiped = persistSyntheticEvent((...args)=>this.onSwiped(...args), persistEvent);
    }

    return (
      <div className="row" id="FeatureTestConsole">
        <div className="small-12 column">
          <h5><strong>Test react-swipeable features.</strong></h5>
          <SwipeableHook
            {...boundSwipes}
            {...swipeableDirProps}
            delta={deltaNum}
            preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
            trackTouch={trackTouch}
            trackMouse={trackMouse}
            rotationAngle={rotationAngleNum}
            className="callout hookComponent"
            style={swipeableStyle}>
              <div onTouchStart={()=>this.resetState()}>
                <h5>Hook - Swipe inside here to test</h5>
                <p>See output below and check the console for 'onSwiping' and 'onSwiped' callback output(open dev tools)</p>
                <span>You can also 'toggle' the swip(ed/ing) props being applied to this container below.</span>
              </div>
          </SwipeableHook>
          <table>
            <thead>
              <tr><th>Applied?</th><th>Action</th><th>Output</th></tr>
            </thead>
            <tbody>
              <tr style={{color: onSwipingApplied ? '#000000' : '#cccccc'}}>
                <td className="text-center">
                  <input type="checkbox" checked={onSwipingApplied} style={{margin: "0"}}
                    onChange={(e)=>this.updateValue('onSwipingApplied', e.target.checked)} />
                </td>
                <td>onSwiping</td><td>{swiping ? 'True' : 'False'}</td>
              </tr>
              <tr style={{color: onSwipedApplied ? '#000000' : '#cccccc'}}>
                <td className="text-center">
                  <input type="checkbox" checked={onSwipedApplied} style={{margin: "0"}}
                    onChange={(e)=>this.updateValue('onSwipedApplied', e.target.checked)} />
                </td>
                <td>onSwiped</td><td>{swiped ? 'True' : 'False'}</td>
              </tr>
              <tr>
                <td className="text-center"></td>
                <td>onSwiping Direction</td><td>{swipingDirection}</td>
              </tr>
              <tr>
                <td className="text-center">
                  <a href="#" onClick={(e)=>(e.preventDefault(),this.updateValue('showOnSwipeds', !showOnSwipeds))}>
                    {showOnSwipeds ? '↑ Hide ↑' : '↓ Show ↓'}
                  </a>
                </td>
                <td>onSwiped Direction</td><td>{swipedDirection}</td>
              </tr>
              {showOnSwipeds && <tr>
                <td className="text-center" colSpan="3">
                  <table id="appliedDirs">
                    <thead>
                      <tr><th colSpan="2" className="text-center">onSwiped</th></tr>
                      <tr><th>Applied?</th><th>Direction</th></tr>
                    </thead>
                    <tbody>
                      {DIRECTIONS.map(this._renderAppliedDirRow.bind(this))}
                    </tbody>
                  </table>
                </td>
              </tr>}
              <tr>
                <td colSpan="2" className="text-center">delta:</td>
                <td>
                  <input type="text"
                    style={{margin: '0px', border: !isDeltaNumber ? '2px solid red' : ''}}
                    onChange={(e)=>this.updateValue('delta', getVal(e))} value={delta}/>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-center">rotationAngle:</td>
                <td>
                  <input type="text"
                    style={{margin: '0px', border: !isRotationAngleNumber ? '2px solid red' : ''}}
                    onChange={(e)=>this.updateValue('rotationAngle', getVal(e))} value={rotationAngle}/>
                </td>
              </tr>
              <RowSimpleCheckbox
                value={preventDefaultTouchmoveEvent}
                name="preventDefaultTouchmoveEvent"
                onChange={this.updateValue}
              />
              <RowSimpleCheckbox
                value={trackTouch}
                name="trackTouch"
                onChange={this.updateValue}
              />
              <RowSimpleCheckbox
                value={trackMouse}
                name="trackMouse"
                onChange={this.updateValue}
              />
              <tr>
                <td colSpan="2" className="text-center">Persist React Events for logging:</td>
                <td style={{textAlign: "center"}}>
                  <input style={{margin: "0px"}}
                    type="checkbox"
                    checked={persistEvent}
                    onChange={(e)=>this.updateValue('persistEvent', e.target.checked)}/>
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{width: "100%"}}>
            <tbody>

            </tbody>
          </table>
          <button type="button" className="tiny button expanded" onClick={()=>this.resetState(true)}>Reset All Options</button>
        </div>
      </div>
    )
  }
}

function getBoundSwipes(component) {
  const {persistEvent} = component.state;
  let boundSwipes = {};
  DIRECTIONS.forEach((dir)=>{
    if (component.state[`onSwiped${dir}Applied`]) {
      boundSwipes[`onSwiped${dir}`] = persistSyntheticEvent(component.onSwipedDirection.bind(component, dir), persistEvent);
    }
  });
  return boundSwipes;
}

function getVal(e) {
  return e.target.value;
}
