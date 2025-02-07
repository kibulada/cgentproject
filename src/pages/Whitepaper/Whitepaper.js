import React from 'react';
import './Whitepaper.css';

const Whitepaper = () => {
  return (
    <div className="whitepaper-container">
      <div className="pdf-viewer">
        <iframe
          src="/CGENT_Whitepaper.pdf#toolbar=0&navpanes=0&statusbar=0&view=FitH"
          title="CGENT Whitepaper"
          className="pdf-frame"
        />
      </div>
      <div className="download-section">
        <a 
          href="/CGENT_Whitepaper.pdf" 
          download
          className="download-button"
        >
          Download Whitepaper
        </a>
      </div>
    </div>
  );
};

export default Whitepaper; 