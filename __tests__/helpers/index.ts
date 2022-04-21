export type MockedSwipeFunctions = {
  onSwiping: jest.Mock;
  onSwiped: jest.Mock;
  onSwipedLeft: jest.Mock;
  onSwipedRight: jest.Mock;
  onSwipedUp: jest.Mock;
  onSwipedDown: jest.Mock;
};

const expectSwipingDir = (fns: jest.Mock, dir: string) => {
  fns.mock.calls.forEach((call) => {
    expect(call[0].dir).toBe(dir);
  });
};

export const expectSwipeFuncsDir = (
  sf: MockedSwipeFunctions,
  dir: string
): void => {
  Object.keys(sf).forEach((s) => {
    if (s.endsWith(dir) || s === "onSwiped") {
      expect(sf[s as keyof MockedSwipeFunctions]).toHaveBeenCalled();
    } else if (s === "onSwiping") {
      expectSwipingDir(sf[s], dir);
    } else {
      expect(sf[s as keyof MockedSwipeFunctions]).not.toHaveBeenCalled();
    }
  });
};
