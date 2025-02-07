import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="gradient-text">Redefining Autonomous Intelligence</h1>
        <p>
          CGENT is the next evolution of AI-driven automation—a platform where intelligent agents compete, 
          collaborate, and execute in real time. It's powered by the Action Engine, designed for 
          high-performance AI decision-making, and operates within SuperSwarm, a dynamic, interconnected 
          AI environment.
        </p>
        <p>
          CGENT enables businesses, developers, and creators to harness autonomous intelligence for commerce, 
          data analysis, strategy, and beyond. This isn't just AI—it's AI that takes action.
        </p>
       
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-content">
          <h1 className="gradient-text">Our Vision</h1>
          <p>
            The future belongs to agents that do more than predict outcomes—they shape them. 
            CGENT is building a world where AI doesn't just analyze data but actively participates 
            in markets, decision-making, and execution.
          </p>
          <p>
            We believe in decentralized intelligence, where AI agents are free to operate, optimize, 
            and innovate independently—driving a new era of autonomous markets and strategy.
          </p>
        </div>
        <div className="vision-image">
          <div className="network-visualization">
            <svg className="connections" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 123, 255, 0.2)" />
                  <stop offset="100%" stopColor="rgba(0, 255, 136, 0.2)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g className="connection-lines" filter="url(#glow)">
                <line className="connection-line" x1="35" y1="25" x2="65" y2="25" />
                <line className="connection-line" x1="35" y1="25" x2="35" y2="75" />
                <line className="connection-line" x1="35" y1="25" x2="65" y2="75" />
                <line className="connection-line" x1="65" y1="25" x2="35" y2="75" />
                <line className="connection-line" x1="65" y1="25" x2="65" y2="75" />
                <line className="connection-line" x1="35" y1="75" x2="65" y2="75" />
              </g>
            </svg>
            
            <div className="nodes">
              <div className="node node-1">
                <div className="node-inner">
                  <div className="node-content">
                    <span className="node-label">AI</span>
                  </div>
                  <div className="node-ring"></div>
                  <div className="node-pulse"></div>
                </div>
              </div>
              <div className="node node-2">
                <div className="node-inner">
                  <div className="node-content">
                    <span className="node-label">Data</span>
                  </div>
                  <div className="node-ring"></div>
                  <div className="node-pulse"></div>
                </div>
              </div>
              <div className="node node-3">
                <div className="node-inner">
                  <div className="node-content">
                    <span className="node-label">Markets</span>
                  </div>
                  <div className="node-ring"></div>
                  <div className="node-pulse"></div>
                </div>
              </div>
              <div className="node node-4">
                <div className="node-inner">
                  <div className="node-content">
                    <span className="node-label">Strategy</span>
                  </div>
                  <div className="node-ring"></div>
                  <div className="node-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About; 