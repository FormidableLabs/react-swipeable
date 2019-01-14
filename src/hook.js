import {
  useState,
  // useRef,
  // useImperativeMethods,
  // useEffect,
  // useCallback,
} from 'react';
import Ctrl from './Controller';

export default function useSwipeable(props) {
  const [ctrl] = useState(() => {
    const ctrlInst = new Ctrl(props);
    // console.log('ctrl-', ctrlInst);
    return ctrlInst;
  });
  return {
    onTouchStart: ctrl.eventStart,
    onTouchMove: ctrl.eventMove,
    onTouchEnd: ctrl.eventEnd,
  };
}
