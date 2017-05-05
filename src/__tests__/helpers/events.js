function createClientXYObject(x, y) {
  return { clientX: x, clientY: y };
}

export function createStartTouchEventObject({ x = 0, y = 0, preventDefault = () => {} }) {
  return {
    touches: [createClientXYObject(x, y)],
    preventDefault,
  };
}

export function createMoveTouchEventObject(props) {
  const { x = 0, y = 0, includeTouches = true, preventDefault = () => {} } = props;
  const moveTouchEvent = {
    changedTouches: [createClientXYObject(x, y)],
    preventDefault,
  };
  if (includeTouches) moveTouchEvent.touches = [createClientXYObject(x, y)];
  return moveTouchEvent;
}

export function createMouseEventObject({ x = 0, y = 0, preventDefault = () => {} }) {
  return {
    ...createClientXYObject(x, y),
    preventDefault,
  };
}
