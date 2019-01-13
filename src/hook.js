import {
  useState,
  // useRef,
  // useImperativeMethods,
  // useEffect,
  // useCallback,
} from 'react'
import Ctrl from './Controller';

export default function useSwipeable(props) {
  const [ctrl] = useState(() => new Ctrl(props));
  return {
    onTouchStart: ctrl.eventStart,
    onTouchMove: ctrl.eventMove,
    onTouchEnd: ctrl.eventEnd,
  };
}
