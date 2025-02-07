import React, { useState, useEffect } from 'react';
import './SuperSwarm.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

const SuperSwarm = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    fee: 0,
    capabilities: [],
    restrictSubscriptions: false
  });
  const [newCapability, setNewCapability] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newAgentData, setNewAgentData] = useState(null);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [subscribeData, setSubscribeData] = useState({
    apiEndpoint: '',
    duration: 30
  });
  const [showNotification, setShowNotification] = useState(false);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Get Phantom Provider
  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    // Hapus auto-redirect ke Phantom
    return null;
  };

  // Sign Message with Wallet
  const signMessage = async (message) => {
    try {
      const provider = getProvider();
      if (!provider) throw new Error('Wallet not found');

      // Convert string to Uint8Array
      const messageBytes = new TextEncoder().encode(message);
      
      // Request signature
      const { signature } = await provider.signMessage(messageBytes, "utf8");
      
      // Convert signature to hex string
      const signatureHex = Array.from(signature)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      console.log('Generated signature:', signatureHex);
      return signatureHex;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  // Fetch Agents
  const fetchAgents = async () => {
    if (!walletAddress) {
      console.log('Waiting for wallet connection...');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching agents for wallet:', walletAddress);

      // Cek apakah sudah ada signature yang valid
      let signature = localStorage.getItem('lastSignature');
      const lastSignatureTime = localStorage.getItem('signatureTimestamp');
      const signatureExpiry = 30 * 60 * 1000; // 30 menit dalam milliseconds

      // Jika tidak ada signature atau signature sudah expired, minta signature baru
      if (!signature || !lastSignatureTime || (Date.now() - parseInt(lastSignatureTime) > signatureExpiry)) {
        const message = "Fetch Agents Authentication";
        signature = await signMessage(message);
        
        // Simpan signature baru dan timestamp
        localStorage.setItem('lastSignature', signature);
        localStorage.setItem('signatureTimestamp', Date.now().toString());
      }

      const headers = {
        'Content-Type': 'application/json',
        'x-signature': signature,
        'x-public-key': walletAddress,
        'x-message': "Fetch Agents Authentication"
      };

      const response = await axios.get(`${API_BASE_URL}/api/agents`, { 
        headers,
        timeout: 10000
      });

      if (response.status === 200) {
        console.log('Agents fetched:', response.data);
        setAgents(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Jika error 401 (unauthorized), hapus signature lama dan coba lagi
      if (error.response?.status === 401) {
        localStorage.removeItem('lastSignature');
        localStorage.removeItem('signatureTimestamp');
        setError('Session expired. Please try again.');
      } else {
        setError('Failed to fetch agents. Please try again.');
      }
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        window.open("https://phantom.app/", "_blank");
        return;
      }
      
      const resp = await provider.connect(); // Popup hanya muncul di sini
      const address = resp.publicKey.toString();
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);
      console.log('Connected to wallet:', address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError('Failed to connect wallet');
    }
  };

  // Disconnect Wallet
  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (provider) {
        await provider.disconnect();
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('lastSignature');
        localStorage.removeItem('signatureTimestamp');
        setAgents([]);
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  // Generate random wallet-like address
  const generateRandomKey = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 44; i++) {  // Solana addresses are 44 chars
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Format public key untuk display (4 huruf awal...4 huruf akhir)
  const formatPublicKey = (key) => {
    if (!key) return '';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  // Handle Register Agent - dengan random key
  const handleRegisterAgent = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      const randomKey = generateRandomKey();

      const agentData = {
        name: newAgent.name,
        description: newAgent.description,
        fee: newAgent.fee,
        capabilities: newAgent.capabilities,
        restrictSubscriptions: newAgent.restrictSubscriptions,
        ownerWallet: walletAddress,
        publicKey: randomKey
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/agents`,
        agentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': walletAddress
          }
        }
      );

      if (response.data.success) {
        setShowRegisterForm(false);
        setNewAgentData({
          ...agentData,
          formattedKey: formatPublicKey(randomKey)
        });
        setShowSuccessPopup(true);
        setNewAgent({
          name: '',
          description: '',
          fee: 0,
          capabilities: [],
          restrictSubscriptions: false
        });
        fetchAgents();
        
        // Auto hide success popup after 5 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setNewAgentData(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error registering agent:', error);
      setError(error.response?.data?.error || 'Failed to register agent');
    } finally {
      setLoading(false);
    }
  };

  // Add Capability
  const handleAddCapability = () => {
    if (newCapability.trim()) {
      setNewAgent({
        ...newAgent,
        capabilities: [...newAgent.capabilities, newCapability.trim()]
      });
      setNewCapability('');
    }
  };

  // Remove Capability
  const handleRemoveCapability = (index) => {
    setNewAgent({
      ...newAgent,
      capabilities: newAgent.capabilities.filter((_, i) => i !== index)
    });
  };

  // Handle Subscribe Button Click
  const handleSubscribeClick = (agent) => {
    setSelectedAgent(agent);
    setShowSubscribeForm(true);
  };

  // Handle Subscribe Submit - Simplified mock function
  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    
    // Close subscribe form
    setShowSubscribeForm(false);
    setSelectedAgent(null);
    
    // Reset form
    setSubscribeData({
      apiEndpoint: '',
      duration: 30
    });
    
    // Show notification
    setShowNotification(true);
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Tambahkan fungsi untuk menangani klik pada row
  const handleRowClick = (agent) => {
    setSelectedAgentDetail(agent);
  };

  // Modifikasi useEffect untuk wallet connection
  useEffect(() => {
    // Cek wallet address di localStorage saat komponen mount
    const savedWalletAddress = localStorage.getItem('walletAddress');
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
    }

    const provider = getProvider();
    if (provider) {
      provider.on("connect", (publicKey) => {
        const address = publicKey.toString();
        setWalletAddress(address);
        localStorage.setItem('walletAddress', address);
      });

      provider.on("disconnect", () => {
        setWalletAddress(null);
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('lastSignature');
        localStorage.removeItem('signatureTimestamp');
        setAgents([]);
      });
    }

    return () => {
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, []);

  // Modifikasi useEffect
  useEffect(() => {
    if (walletAddress) {
      fetchAgents();
    }
  }, [walletAddress]); // Dependency hanya pada walletAddress

  return (
    <div className="superswarm">
      {/* Hero Section */}
      <section className="superswarm-hero">
        <h1 className="gradient-text">AI Coordination at Scale</h1>
        <p>
          Superswarm is the decentralized intelligence layer of CGENT, where AI agents 
          collaborate, compete, and optimize in real time. Unlike traditional AI models 
          that operate in isolation, Superswarm Intelligence leverages networked AI 
          coordination to drive superior decision-making and execution at scale.
        </p>
      </section>

      {/* Agents Section */}
      <section className="agents-section">
        <div className="agents-container">
          <div className="header-actions">
            {!walletAddress ? (
              <div className="welcome-section">
                <div className="welcome-text"> 
                  Please connect your wallet to view available agents
                </div>
                <button className="connect-btn" onClick={connectWallet}>
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="wallet-info">
                <div className="wallet-actions">
                  <div className="wallet-group">
                    <div className="wallet-label">Connected Wallet: {formatPublicKey(walletAddress)}</div>
             
                  </div>
                  <div className="wallet-buttons">
                    <button className="register-btn" onClick={() => setShowRegisterForm(true)}>
                      Register Agent
                    </button>
                    <button className="disconnect-btn" onClick={disconnectWallet}>
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {walletAddress && (
            <div className="agents-table">
              <div className="table-header">
                <div className="header-cell">Name</div>
                <div className="header-cell">Public Key</div>
                <div className="header-cell">Capabilities</div>
                <div className="header-cell">Allow Subscriptions</div>
                <div className="header-cell">Fee</div>
                <div className="header-cell">Subscribers</div>
                <div className="header-cell"></div>
              </div>

              {loading ? (
                <div className="loading-state">Loading agents...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : (
                <div className="table-content">
                  {agents.map((agent, index) => (
                    <div 
                      key={index} 
                      className="table-row"
                      onClick={() => handleRowClick(agent)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="cell name-cell">{agent.name}</div>
                      <div className="cell key-cell">{formatPublicKey(agent.publicKey)}</div>
                      <div className="cell capabilities-cell">
                        {Array.isArray(agent.capabilities) && 
                          agent.capabilities.map((cap, i) => (
                            <span key={i} className="capability-tag">{cap}</span>
                          ))
                        }
                      </div>
                      <div className="cell allow-cell">
                        {agent.restrictSubscriptions ? 'No' : 'Yes'}
                      </div>
                      <div className="cell fee-cell">{agent.fee} CGENT</div>
                      <div className="cell subscribers-cell">{agent.subscribers || 0}</div>
                      <div className="cell action-cell">
                        <button 
                          className="action-btn subscribe"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscribeClick(agent);
                          }}
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Screen Size Warning */}
      <div className="screen-warning">
        <p>The SuperSwarm interface is currently only available on larger screens. 
        Please visit this page on a desktop or tablet device.</p>
      </div>

      {showRegisterForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register New Agent</h2>
              <button 
                className="close-btn"
                onClick={() => setShowRegisterForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleRegisterAgent} className="register-form">
              <div className="form-group">
                <label>Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    placeholder="Enter agent name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <div className="input-wrapper">
                  <textarea
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                    placeholder="Enter agent description"
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fee (CGENT per day)</label>
                <div className="input-wrapper fee-input">
                  <input
                    type="number"
                    value={newAgent.fee}
                    onChange={(e) => setNewAgent({...newAgent, fee: Number(e.target.value)})}
                    min="0"
                    required
                  />
                  <span className="fee-currency">CGENT</span>
                </div>
              </div>

              <div className="form-group">
                <label>Capabilities</label>
                <div className="capability-input">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                      placeholder="Add capability"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={handleAddCapability}
                  >
                    Add
                  </button>
                </div>
                <div className="capabilities-list">
                  {newAgent.capabilities.map((cap, index) => (
                    <span key={index} className="capability-tag">
                      {cap}
                      <button 
                        type="button"
                        className="remove-cap"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCapability(index);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

             

              <button type="submit" className="register-submit-btn">
                Register Agent
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && newAgentData && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>Agent Created Successfully!</h3>
            <div className="agent-details">
              <p className="agent-name">{newAgentData.name}</p>
              <p className="agent-key">{newAgentData.formattedKey}</p>
              <div className="agent-capabilities">
                {newAgentData.capabilities.map((cap, index) => (
                  <span key={index} className="success-capability-tag">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
            <button 
              className="close-success-btn"
              onClick={() => setShowSuccessPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Subscribe Form Popup */}
      {showSubscribeForm && selectedAgent && (
        <div className="modal-overlay">
          <div className="subscribe-modal">
            <div className="modal-header">
              <h3>Subscribe to {selectedAgent.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSubscribeForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubscribeSubmit} className="subscribe-form">
              <div className="form-group">
                <label>API Endpoint</label>
                <input
                  type="text"
                  value={subscribeData.apiEndpoint}
                  onChange={(e) => setSubscribeData({
                    ...subscribeData,
                    apiEndpoint: e.target.value
                  })}
                  placeholder="https://your-api-endpoint.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subscription Duration (Days)</label>
                <input
                  type="number"
                  value={subscribeData.duration}
                  onChange={(e) => setSubscribeData({
                    ...subscribeData,
                    duration: parseInt(e.target.value)
                  })}
                  min="1"
                  required
                />
              </div>

              <button type="submit" className="subscribe-submit-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="notification-popup">
          <div className="notification-content">
            <span className="notification-icon">✓</span>
            You will get notification soon
          </div>
        </div>
      )}

      {/* Tambahkan modal detail agent */}
      {selectedAgentDetail && (
        <div className="modal-overlay">
          <div className="agent-detail-modal">
            <div className="modal-header">
              <h2>{selectedAgentDetail.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedAgentDetail(null)}
              >
                ×
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-label">Description</div>
              <div className="detail-value">{selectedAgentDetail.description}</div>
            </div>

            <div className="detail-section">
              <div className="detail-label">Public Key</div>
              <div className="detail-value">{selectedAgentDetail.publicKey}</div>
            </div>

            <div className="detail-section">
              <div className="detail-label">Capabilities</div>
              <div className="capabilities-list">
                {selectedAgentDetail.capabilities.map((cap, index) => (
                  <span key={index} className="capability-tag">{cap}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-label">Fee</div>
              <div className="detail-value">{selectedAgentDetail.fee} CGENT</div>
            </div>

            <div className="detail-section">
              <div className="detail-label">Allow Subscriptions</div>
              <div className="detail-value">
                {selectedAgentDetail.restrictSubscriptions ? 'No' : 'Yes'}
              </div>
            </div>

            <button 
              className="subscribe-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAgentDetail(null);
                handleSubscribeClick(selectedAgentDetail);
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperSwarm; 