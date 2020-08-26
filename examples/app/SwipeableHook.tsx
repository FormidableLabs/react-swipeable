import React from 'react';
import { useSwipeable } from '../../src/index';

function SwipeableHook(props: any) {
  const { children, className, style, ...rest } = props;
  const eventHandlers = useSwipeable(rest);
  return (<div {...eventHandlers} style={style} className={className}>{children}</div>);
}

export default SwipeableHook;
