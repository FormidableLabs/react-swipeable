
function createClientXYObject(x, y) {
  return { clientX: x, clientY: y };
}

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return {
    touches: [createClientXYObject(x, y)],
  };
}

export function createMoveTouchEventObject({ x = 0, y = 0, includeTouches = true }) {
  const moveTouchEvent = {
    changedTouches: [createClientXYObject(x, y)],
  };
  if (includeTouches) moveTouchEvent.touches = [createClientXYObject(x, y)];
  return moveTouchEvent;
}

export function createMouseEventObject({ x = 0, y = 0 }) {
  return {
    ...createClientXYObject(x, y),
  };
}
