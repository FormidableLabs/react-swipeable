import React from 'react';
import useSwipeable from '../../src/hook';

function SwipeableHook(props) {
  const { children, className, ...rest } = props;
  const eventHandlers = useSwipeable(rest);
  return (<div {...eventHandlers} className={className}>{children}</div>);
}

export default SwipeableHook;
