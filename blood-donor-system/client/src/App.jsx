import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RegisterDonor from './pages/RegisterDonor';
import RequestBlood from './pages/RequestBlood';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content" style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterDonor />} />
            <Route path="/request" element={<RequestBlood />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
