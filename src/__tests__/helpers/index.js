/* global expect */
const expectSwipingDir = (fns, dir) => {
  fns.mock.calls.forEach((call) => {
    expect(call[0].dir).toBe(dir);
  });
};

export const expectSwipeFuncsDir = (sf, dir) =>
  Object.keys(sf).forEach((s) => {
    if (s.endsWith(dir) || s === "onSwiped") {
      expect(sf[s]).toHaveBeenCalled();
    } else if (s === "onSwiping") {
      expectSwipingDir(sf[s], dir);
    } else {
      expect(sf[s]).not.toHaveBeenCalled();
    }
  });
