import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Banking from './pages/Banking';
import CreditCards from './pages/CreditCards';
import Mortgages from './pages/Mortgages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/mortgages" element={<Mortgages />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;