import React, { Component } from "react";
import { RowSimpleCheckbox } from "./TableComponents";
import SwipeableHook from "./SwipeableHook";
import { PatternBox } from "../components";

const DIRECTIONS = ["Left", "Right", "Up", "Down"];

const initialState = {
  swiping: false,
  swiped: false,
  tapped: false,
  swipingDirection: "",
  swipedDirection: "",
};
const INFINITY = "Infinity";
const initialStateSwipeable = {
  delta: "10",
  preventScrollOnSwipe: false,
  trackMouse: false,
  trackTouch: true,
  rotationAngle: 0,
  swipeDuration: INFINITY,
};
const initialStateApplied = {
  showOnSwipeds: false,
  onSwipingApplied: true,
  onSwipedApplied: true,
  onTapApplied: true,
  stopScrollCss: false,
};

interface IState {
  swiping: boolean;
  swiped: boolean;
  tapped: boolean;
  swipingDirection: string;
  swipedDirection: string;
  delta: string;
  swipeDuration: string;
  preventScrollOnSwipe: boolean;
  trackMouse: boolean;
  trackTouch: boolean;
  rotationAngle: number | string;
  showOnSwipeds: boolean;
  onSwipingApplied: boolean;
  onSwipedApplied: boolean;
  onTapApplied: boolean;
  stopScrollCss: boolean;
}

export default class Main extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = Object.assign(
      {},
      initialState,
      initialStateSwipeable,
      initialStateApplied
    );
    this.updateValue = this.updateValue.bind(this);
  }

  resetState(resetAll?: boolean) {
    if (resetAll) {
      this.setState(
        Object.assign(
          {},
          initialState,
          initialStateSwipeable,
          initialStateApplied
        )
      );
    } else {
      this.setState(initialState);
    }
  }

  onSwiped(args: any) {
    console.log("swiped args: ", args);
    this.setState({
      swiped: true,
      swiping: false,
    });
  }

  onSwiping(args: any) {
    console.log("swiping args: ", args);

    this.setState({
      swiping: true,
      swiped: false,
      swipingDirection: args.dir,
    });
  }

  onTap(args: any) {
    console.log("tap args: ", args);

    this.setState({
      swiping: false,
      swiped: false,
      tapped: true,
    });
  }

  onSwipedDirection(direction: any) {
    this.setState({
      swipedDirection: direction,
    });
  }

  updateValue(type: string, value: any) {
    // @ts-ignore
    this.setState({ [type]: value });
  }

  _renderAppliedDirRow(dir: string) {
    // @ts-ignore
    const checked = this.state[`onSwiped${dir}Applied`];

    return (
      <tr key={`appliedDirRow${dir}`}>
        <td className="text-center">
          <input
            type="checkbox"
            style={{ margin: "0" }}
            checked={checked}
            onChange={(e) =>
              this.updateValue(`onSwiped${dir}Applied`, e.target.checked)
            }
          />
        </td>
        <td>{dir}</td>
      </tr>
    );
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
      preventScrollOnSwipe,
      trackTouch,
      trackMouse,
      rotationAngle,
      swipeDuration,
      stopScrollCss,
    } = this.state;

    const isSwipeDurationInfinity = swipeDuration === INFINITY;
    const swipeDurationTextValue = isSwipeDurationInfinity
      ? INFINITY
      : swipeDuration;
    const isSwipeDurationNumber = isSwipeDurationInfinity
      ? Infinity
      : !(isNaN(swipeDuration as any) || swipeDuration === "");

    const isDeltaNumber = !(isNaN(delta as any) || delta === "");
    const isRotationAngleNumber = !(
      isNaN(rotationAngle as any) || rotationAngle === ""
    );
    const deltaNum = isDeltaNumber ? +delta : 10;
    const rotationAngleNum = isRotationAngleNumber ? +rotationAngle : 0;

    const swipeableStyle = {
      fontSize: "0.75rem",
      touchAction: stopScrollCss ? "none" : "auto",
    };

    const boundSwipes = getBoundSwipes(this);
    let swipeableDirProps: any = {};
    if (onSwipingApplied) {
      // @ts-ignore
      swipeableDirProps.onSwiping = (...args: any) => this.onSwiping(...args);
    }
    if (onSwipedApplied) {
      // @ts-ignore
      swipeableDirProps.onSwiped = (...args: any) => this.onSwiped(...args);
    }
    if (onTapApplied) {
      // @ts-ignore
      swipeableDirProps.onTap = (...args: any) => this.onTap(...args);
    }

    return (
      <div className="row">
        <div className="small-12 column">
          <SwipeableHook
            {...boundSwipes}
            {...swipeableDirProps}
            delta={deltaNum}
            preventScrollOnSwipe={preventScrollOnSwipe}
            trackTouch={trackTouch}
            trackMouse={trackMouse}
            rotationAngle={rotationAngleNum}
            swipeDuration={swipeDuration}
            className="callout hookComponent"
            style={swipeableStyle}
          >
            <div
              onTouchStart={() => this.resetState()}
              onMouseDown={() => this.resetState()}
            >
              <PatternBox className="card self-center text-center">
                <div className="card__header">
                  <h3>👆 Swipeable Box 👆</h3>
                </div>
                <div className="card__body">
                  Swipe within this box to test the <code>useSwipeable</code>{" "}
                  hook. Open the browser console window to see the event
                  details.
                </div>
              </PatternBox>
            </div>
          </SwipeableHook>
          <p>
            See output below and check the console for 'onSwiping' and
            'onSwiped' callback output(open dev tools)
          </p>
          <span>
            You can also 'toggle' the swiped props being applied to this
            container below.
          </span>
          <table>
            <thead>
              <tr>
                <th>Applied?</th>
                <th>Action</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={onSwipingApplied}
                    style={{ margin: "0" }}
                    onChange={(e) =>
                      this.updateValue("onSwipingApplied", e.target.checked)
                    }
                  />
                </td>
                <td>onSwiping</td>
                <td>{swiping ? "True" : "False"}</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={onSwipedApplied}
                    style={{ margin: "0" }}
                    onChange={(e) =>
                      this.updateValue("onSwipedApplied", e.target.checked)
                    }
                  />
                </td>
                <td>onSwiped</td>
                <td>{swiped ? "True" : "False"}</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={onTapApplied}
                    style={{ margin: "0" }}
                    onChange={(e) =>
                      this.updateValue("onTapApplied", e.target.checked)
                    }
                  />
                </td>
                <td>onTap</td>
                <td>{tapped ? "True" : "False"}</td>
              </tr>
              <tr>
                <td className="text-center"></td>
                <td>onSwiping Direction</td>
                <td>{swipingDirection}</td>
              </tr>
              <tr>
                <td className="text-center">
                  <a
                    href="#"
                    onClick={(e) => (
                      e.preventDefault(),
                      this.updateValue("showOnSwipeds", !showOnSwipeds)
                    )}
                  >
                    {showOnSwipeds ? "↑ Hide ↑" : "↓ Show ↓"}
                  </a>
                </td>
                <td>onSwiped Direction</td>
                <td>{swipedDirection}</td>
              </tr>
              {showOnSwipeds && (
                <tr>
                  <td className="text-center" colSpan={3}>
                    <table id="appliedDirs">
                      <thead>
                        <tr>
                          <th colSpan={2} className="text-center">
                            onSwiped
                          </th>
                        </tr>
                        <tr>
                          <th>Applied?</th>
                          <th>Direction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DIRECTIONS.map(this._renderAppliedDirRow.bind(this))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={2} className="text-center">
                  delta:
                </td>
                <td>
                  <input
                    type="text"
                    style={{
                      margin: "0px",
                      border: !isDeltaNumber ? "2px solid red" : "",
                    }}
                    onChange={(e) => this.updateValue("delta", getVal(e))}
                    value={delta}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center">
                  rotationAngle:
                </td>
                <td>
                  <input
                    type="text"
                    style={{
                      margin: "0px",
                      border: !isRotationAngleNumber ? "2px solid red" : "",
                    }}
                    onChange={(e) =>
                      this.updateValue("rotationAngle", getVal(e))
                    }
                    value={rotationAngle}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="text-center">
                  swipeDuration:
                  <div>
                    <b>(ms | Infinity)</b>
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    style={{
                      margin: "0px",
                      border: !isSwipeDurationNumber ? "2px solid red" : "",
                    }}
                    onChange={(e) =>
                      this.updateValue("swipeDuration", getVal(e))
                    }
                    value={swipeDurationTextValue}
                  />
                </td>
              </tr>
              <RowSimpleCheckbox
                value={preventScrollOnSwipe}
                name="preventScrollOnSwipe"
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
          <table style={{ width: "100%" }}>
            <tbody>
              <RowSimpleCheckbox
                value={stopScrollCss}
                name="stopScrollCss"
                displayText="Prevent scroll via CSS (touch-action)"
                onChange={this.updateValue}
              />
            </tbody>
          </table>
          <button
            type="button"
            className="tiny expanded"
            onClick={() => this.resetState(true)}
          >
            Reset All Options
          </button>
        </div>
      </div>
    );
  }
}

function getBoundSwipes(component: any) {
  let boundSwipes = {};
  DIRECTIONS.forEach((dir) => {
    if (component.state[`onSwiped${dir}Applied`]) {
      // @ts-ignore
      boundSwipes[`onSwiped${dir}`] = component.onSwipedDirection.bind(
        component,
        dir
      );
    }
  });
  return boundSwipes;
}

function getVal(e: any) {
  return e.target.value;
}
