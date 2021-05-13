import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';

ReactDOM.render(
  // @ts-ignore
  <App version={SWIPEABLE_VERSION} />,
  document.getElementById('app')
);
