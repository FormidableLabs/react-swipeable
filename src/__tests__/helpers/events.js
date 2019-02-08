function createClientXYObject(x, y) {
  return { clientX: x, clientY: y }
}
const preventDefault = () => {}
export function createTouchEventObject({ x, y, ...rest }) {
  return {
    touches: [createClientXYObject(x, y)],
    preventDefault,
    ...rest
  }
}

export function createMouseEventObject({ x, y, ...rest }) {
  return {
    ...createClientXYObject(x, y),
    preventDefault,
    ...rest
  }
}
