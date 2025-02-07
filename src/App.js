import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import SuperSwarm from './pages/SuperSwarm/SuperSwarm';
import Docs from './pages/Docs/Docs';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/superswarm" element={<SuperSwarm />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
