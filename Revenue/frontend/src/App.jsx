import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RevPredict from './pages/RevPredict';
import Expense from './pages/Expense';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/RevPredict" element={<RevPredict />} />
      <Route path="/Expense" element={<Expense />} />
    </Routes>
  </BrowserRouter>
);

export default App;
