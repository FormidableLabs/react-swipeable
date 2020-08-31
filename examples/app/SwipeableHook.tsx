import React from 'react';
import { useSwipeable } from '../../src/index';

function SwipeableHook(props: any) {
  //const myRef = React.useRef(null);
  const { children, className, style, ...rest } = props;
  // const bind = useSwipeable(rest, {domTarget: myRef, eventConfig: {passive: true}})

  // React.useEffect(bind, [bind]);
  // return (<div ref={myRef} style={style} className={className}>{children}</div>)

  const eventHandlers = useSwipeable(rest);
  console.log("eventHandlers", eventHandlers)
  return (<div {...eventHandlers} style={style} className={className}>{children}</div>);
}

export default SwipeableHook;
