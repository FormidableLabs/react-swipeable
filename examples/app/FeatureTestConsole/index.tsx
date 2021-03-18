import React, {Component} from 'react';
import { RowSimpleCheckbox } from './TableComponents';
import SwipeableHook from './SwipeableHook';

const DIRECTIONS = ['Left', 'Right', 'Up', 'Down'];

const initialState = {
  swiping: false,
  swiped: false,
  tapped: false,
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
  onTapApplied: true,
  onSwipedLeftApplied: true,
  onSwipedRightApplied: true,
  onSwipedUpApplied: true,
  onSwipedDownApplied: true,
};

interface IState {
  swiping: boolean;
  swiped: boolean;
  tapped: boolean;
  swipingDirection: string;
  swipedDirection: string;
  delta: string;
  preventDefaultTouchmoveEvent: boolean;
  trackMouse: boolean;
  trackTouch: boolean;
  rotationAngle: number | string;
  showOnSwipeds: boolean;
  onSwipingApplied: boolean;
  onSwipedApplied: boolean;
  onTapApplied: boolean;
  onSwipedLeftApplied: boolean;
  onSwipedRightApplied: boolean;
  onSwipedUpApplied: boolean;
  onSwipedDownApplied: boolean;
}

export default class Main extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = Object.assign({}, initialState, initialStateSwipeable, initialStateApplied);
    this.updateValue = this.updateValue.bind(this);
  }

  resetState(resetAll?: boolean) {
    if (resetAll) {
      this.setState(Object.assign({}, initialState, initialStateSwipeable, initialStateApplied));
    } else {
      this.setState(initialState);
    }
  }

  onSwiped(args: any) {
    console.log('swiped args: ', args)
    this.setState({
      swiped: true,
      swiping: false,
    });
  }

  onSwiping(args: any) {
    console.log('swiping args: ', args)

    this.setState({
      swiping: true,
      swiped: false,
      swipingDirection: args.dir,
    });
  }

  onTap(args: any) {
    console.log('tap args: ', args)

    this.setState({
      swiping: false,
      swiped: false,
      tapped: true
    })
  }

  onSwipedDirection(direction: any) {
    this.setState({
      swipedDirection: direction,
    });
  }

  updateValue(type: string, value: any) {
    // @ts-ignore
    this.setState({ [type]: value, });
  }

  _renderAppliedDirRow(dir: string) {
    // @ts-ignore
    const checked = this.state[`onSwiped${dir}Applied`];
    // @ts-ignore
    const cssJs = {color: this.state[`onSwiped${dir}Applied`] ? '#000000' : '#cccccc'}
    return (
      <tr key={`appliedDirRow${dir}`}>
        <td className="text-center">
          <input type="checkbox" style={{margin: "0"}} checked={checked}
            onChange={(e)=>this.updateValue(`onSwiped${dir}Applied`, e.target.checked)} />
        </td>
        <td style={cssJs}>{dir}</td>
      </tr>
    )
  }

  render() {
    const {
      swiping,
      swiped,
      tapped,
      swipingDirection,
      swipedDirection,
      delta,
      showOnSwipeds,
      onSwipingApplied,
      onSwipedApplied,
      onTapApplied,
      preventDefaultTouchmoveEvent,
      trackTouch,
      trackMouse,
      rotationAngle,
    } = this.state;

    const isDeltaNumber = !(isNaN(delta as any) || delta === '');
    const isRotationAngleNumber = !(isNaN(rotationAngle as any) || rotationAngle === '');
    const deltaNum = isDeltaNumber ? +delta : 10;
    const rotationAngleNum = isRotationAngleNumber ? +rotationAngle : 0;

    const swipeableStyle = {fontSize: "0.75rem"};

    const boundSwipes = getBoundSwipes(this);
    let swipeableDirProps: any = {};
    if (onSwipingApplied) {
      // @ts-ignore
      swipeableDirProps.onSwiping = (...args: any)=>this.onSwiping(...args);
    }
    if (onSwipedApplied) {
      // @ts-ignore
      swipeableDirProps.onSwiped = (...args: any)=>this.onSwiped(...args);
    }
    if(onTapApplied) {
      // @ts-ignore
      swipeableDirProps.onTap = (...args: any) => this.onTap(...args);
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
                <span>You can also 'toggle' the swiped props being applied to this container below.</span>
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
                            <tr style={{color: onTapApplied ? '#000000' : '#cccccc'}}>
                <td className="text-center">
                  <input type="checkbox" checked={onTapApplied} style={{margin: "0"}}
                    onChange={(e)=>this.updateValue('onTapApplied', e.target.checked)} />
                </td>
                <td>onTap</td><td>{tapped ? 'True' : 'False'}</td>
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
                <td className="text-center" colSpan={3}>
                  <table id="appliedDirs">
                    <thead>
                      <tr><th colSpan={2} className="text-center">onSwiped</th></tr>
                      <tr><th>Applied?</th><th>Direction</th></tr>
                    </thead>
                    <tbody>
                      {DIRECTIONS.map(this._renderAppliedDirRow.bind(this))}
                    </tbody>
                  </table>
                </td>
              </tr>}
              <tr>
                <td colSpan={2} className="text-center">delta:</td>
                <td>
                  <input type="text"
                    style={{margin: '0px', border: !isDeltaNumber ? '2px solid red' : ''}}
                    onChange={(e)=>this.updateValue('delta', getVal(e))} value={delta}/>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center">rotationAngle:</td>
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

function getBoundSwipes(component: any) {
  let boundSwipes = {};
  DIRECTIONS.forEach((dir)=>{
    if (component.state[`onSwiped${dir}Applied`]) {
      // @ts-ignore
      boundSwipes[`onSwiped${dir}`] = component.onSwipedDirection.bind(component, dir);
    }
  });
  return boundSwipes;
}

function getVal(e: any) {
  return e.target.value;
}
