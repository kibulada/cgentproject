const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  ownerWallet: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  capabilities: [{
    type: String
  }],
  allowSubscriptions: {
    type: Boolean,
    default: false
  },
  fee: {
    type: Number,
    required: true
  },
  subscribers: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agent', agentSchema); 