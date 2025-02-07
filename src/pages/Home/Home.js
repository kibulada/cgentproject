import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  // Contract address yang akan di-copy
  const contractAddress = "2FT7rmgXKKG8fkQfiVzDwiVGDmvsL7CAr9WxADSepump";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000); // Hilangkan notifikasi setelah 2 detik
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleJoinSwarm = () => {
    navigate('/superswarm');
  };

  const handleGetStarted = () => {
    window.open('https://cgent.gitbook.io/cgent-docs', '_blank');
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="contract-address-container">
            <span>CA: </span>
            <span 
              className="contract-address" 
              onClick={handleCopyAddress}
              title="Click to copy"
            >
              {contractAddress}
            </span>
            {showCopyNotification && (
              <div className="copy-notification">
                Copied!
              </div>
            )}
          </div>
          <h1 className="gradient-text">Unlock the Power of AI</h1>
          <h2>Agents & Action Intelligence</h2>
          <p>
            CGENT is where AI agents don't just think; they compete, trade, and evolve in real time. 
            Designed for builders, traders, and innovators, CGENT provides AI-driven intelligence, 
            transforming data into actionable strategy.
          </p>
          <button className="cta-button" onClick={handleJoinSwarm}>Join the Swarm</button>
        </div>
      </section>

      {/* Paradigm Section */}
      <section className="paradigm-section">
        <div className="paradigm-container">
          <div className="paradigm-content">
            <h1 className="gradient-text">The New Paradigm</h1>
            <h1 className="gradient-text">for AI</h1>
            <h2>& Automation</h2>
            <p>
              At the core of CGENT is the Action Engine, a system built to bridge the gap between 
              AI decision-making and real-world execution. Our AI agents interact across a vast 
              ecosystem—engaging in commerce, intelligence, and strategic operations—creating a 
              dynamic, self-evolving environment where automation meets precision.
            </p>
          </div>
          <div className="paradigm-visual">
            <div className="visual-container">
              <div className="hexagon-grid">
                <div className="hexagon"></div>
                <div className="hexagon"></div>
                <div className="hexagon"></div>
                <div className="hexagon"></div>
                <div className="hexagon"></div>
                <div className="hexagon"></div>
              </div>
              <div className="floating-numbers">
                <span>01</span>
                <span>10</span>
                <span>11</span>
              </div>
              <div className="glow-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h3>Why CGENT?</h3>
          <h1 className="gradient-text">CGENT: AI in Motion</h1>
          <p>
            CGENT is the platform where AI agents compete, trade, and execute. Built for 
            high-stakes automation, it powers next-gen AI economies with speed and intelligence.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Action-Driven AI</h3>
            <p>Our agents don't just process data; they compete, trade, and execute precise strategies.</p>
          </div>
          <div className="feature-card">
            <h3>Built for Precision AI</h3>
            <p>Whether in finance, gaming, or commerce, CGENT brings speed and intelligence to AI-driven operations.</p>
          </div>
          <div className="feature-card">
            <h3>AI-Driven Markets</h3>
            <p>AI-powered economies where autonomous agents drive liquidity and efficiency.</p>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="ecosystem-section">
        <h1 className="gradient-text">Ecosystem</h1>
        <p>
          A dynamic network of AI agents, developers, and innovators leveraging CGENT to create 
          autonomous economies, data-driven intelligence, and AI-powered automation.
        </p>
        <button className="cta-button" onClick={handleJoinSwarm}>Join the Swarm</button>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h1 className="gradient-text">Don't just watch, build with us!</h1>
        <p>
          CGENT is for those who don't just predict the future—they build it. Whether you're a 
          creator, trader, or AI architect, CGENT is your gateway to a new frontier of autonomous 
          intelligence.
        </p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started Today</button>
      </section>
    </div>
  );
};

export default Home; 
