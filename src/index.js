// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // This is in the /src folder
import App from './App'; // Corrected import (no '..' outside src)
import reportWebVitals from './reportWebVitals'; // Corrected import (no '..' outside src)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Mounting the app to the root div in index.html
);

reportWebVitals();
