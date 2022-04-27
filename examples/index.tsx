import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './app/App';

const container = document.getElementById('app');

// Create a root.
// @ts-ignore
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.
// @ts-ignore
root.render(<App version={SWIPEABLE_VERSION} />);
