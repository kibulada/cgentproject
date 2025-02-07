const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Connection, PublicKey } = require('@solana/web3.js');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const Agent = require('./models/Agent');

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_DEV_URL || 'http://localhost:3000',
    process.env.FRONTEND_PROD_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type', 
    'x-signature', 
    'x-public-key', 
    'x-message',
    'x-wallet-address'
  ]
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Fungsi untuk verifikasi signature
const verifySignature = async (signature, publicKey, message) => {
  try {
    // Decode signature dan public key
    const decodedSignature = Buffer.from(signature, 'hex');
    const decodedPublicKey = new PublicKey(publicKey);
    
    // Convert message ke bytes
    const messageBytes = new TextEncoder().encode(message);
    
    // Verify signature
    const verified = nacl.sign.detached.verify(
      messageBytes,
      decodedSignature,
      decodedPublicKey.toBytes()
    );

    return verified;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

// Middleware untuk validasi signature
const validateWalletSignature = async (req, res, next) => {
  try {
    const signature = req.headers['x-signature'];
    const publicKey = req.headers['x-public-key'];
    const message = req.headers['x-message'];
    
    console.log('Validating signature for wallet:', publicKey);
    console.log('Message:', message);
    console.log('Signature length:', signature?.length);

    if (!signature || !publicKey || !message) {
      return res.status(401).json({ 
        error: 'Missing authentication parameters',
        details: {
          signature: !!signature,
          publicKey: !!publicKey,
          message: !!message
        }
      });
    }

    // Convert hex signature back to Uint8Array
    const signatureUint8 = new Uint8Array(
      signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

    // Convert message to Uint8Array
    const messageUint8 = new TextEncoder().encode(message);

    // Convert public key string to PublicKey object
    const pubKey = new PublicKey(publicKey);

    // Verify signature
    const verified = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      pubKey.toBytes()
    );

    if (!verified) {
      console.log('Signature verification failed for wallet:', publicKey);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Signature verified successfully for wallet:', publicKey);
    req.walletAddress = publicKey;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

// Middleware untuk validasi wallet address
const validateWalletAddress = async (req, res, next) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    
    if (!walletAddress) {
      return res.status(401).json({ 
        error: 'Wallet address is required'
      });
    }

    // Validasi format wallet address
    try {
      new PublicKey(walletAddress);
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid wallet address format'
      });
    }

    req.walletAddress = walletAddress;
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(401).json({ 
      error: 'Validation failed',
      details: error.message 
    });
  }
};

// Add root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CAgent API' });
});

// Routes
// Get agents for connected wallet
app.get('/api/agents', validateWalletSignature, async (req, res) => {
  try {
    console.log('Fetching agents for wallet:', req.walletAddress);
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Register new agent
app.post('/api/agents', validateWalletAddress, async (req, res) => {
  try {
    const agentData = {
      ...req.body,
      ownerWallet: req.walletAddress,
      createdAt: new Date()
    };

    const agent = new Agent(agentData);
    await agent.save();

    res.json({ 
      success: true, 
      message: 'Agent created successfully',
      agent 
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ 
      error: 'Failed to create agent',
      details: error.message 
    });
  }
});

// Update agent
app.put('/api/agents/:id', validateWalletSignature, async (req, res) => {
  try {
    const agent = await Agent.findOne({ 
      _id: req.params.id,
      ownerWallet: req.walletAddress 
    });
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found or unauthorized' });
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating agent' });
  }
});

// Delete agent
app.delete('/api/agents/:id', validateWalletSignature, async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      ownerWallet: req.walletAddress
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found or unauthorized' });
    }

    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting agent' });
  }
});

// Handle subscription request
app.post('/api/agents/:id/subscribe', validateWalletSignature, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.restrictSubscriptions) {
      // Create subscription request
      // Implement your subscription request logic here
      res.json({ 
        success: true, 
        message: 'Subscription request sent' 
      });
    } else {
      // Direct subscription
      agent.subscribers = (agent.subscribers || 0) + 1;
      await agent.save();
      
      res.json({ 
        success: true, 
        message: 'Subscribed successfully' 
      });
    }
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Error processing subscription' });
  }
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 