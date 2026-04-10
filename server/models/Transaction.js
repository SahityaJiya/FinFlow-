const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  icon: { type: String, default: 'CreditCard' },
  merchant: { type: String },
  note: { type: String },
  date: { type: Date, default: Date.now },
  paymentMode: { type: String, enum: ['UPI', 'Cash', 'Card', 'Net Banking'], default: 'UPI' },
  isSplit: { type: Boolean, default: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  participants: [{
    user: { type: String, default: null },
    name: { type: String },
    amount: { type: Number },
    settled: { type: Boolean, default: false }
  }],
  splitType: { type: String, enum: ['equal', 'exact'], default: 'equal' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
