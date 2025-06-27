import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import History from './History.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/history" element={<History />} />
    </Routes>
  </Router>
);
