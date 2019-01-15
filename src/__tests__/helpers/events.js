function createClientXYObject(x, y) {
  return { clientX: x, clientY: y };
}

export function createTouchEventObject({ x = 0, y = 0, preventDefault = () => {} }) {
  return {
    touches: [createClientXYObject(x, y)],
    preventDefault,
  };
}

export function createMouseEventObject({ x = 0, y = 0, preventDefault = () => {} }) {
  return {
    ...createClientXYObject(x, y),
    preventDefault,
  };
}
