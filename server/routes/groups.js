const express = require('express');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.userId, isActive: true });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, type, members } = req.body;
    const group = new Group({
      name, description, type,
      owner: req.userId,
      members: [
        { user: req.userId, name: req.user.name, email: req.user.email, avatar: req.user.avatar },
        ...(members || [])
      ]
    });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.user');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/balances', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const transactions = await Transaction.find({ group: req.params.id, isSplit: true });

    const balances = {};
    group.members.forEach(m => {
      balances[m.user.toString()] = { name: m.name, owes: 0, owed: 0, net: 0 };
    });

    transactions.forEach(t => {
      const payerId = t.user.toString();
      const participant = t.participants.find(p => p.user.toString() === payerId);
      if (participant) {
        const share = t.amount / t.participants.length;
        t.participants.forEach(p => {
          if (p.user.toString() !== payerId) {
            balances[p.user.toString()].owes += share;
            balances[payerId].owed += share;
          }
        });
      }
    });

    Object.keys(balances).forEach(id => {
      balances[id].net = balances[id].owed - balances[id].owes;
    });

    const settlements = [];
    const debtors = Object.entries(balances).filter(([_, b]) => b.net < 0).map(([id, b]) => ({ id, amount: Math.abs(b.net) }));
    const creditors = Object.entries(balances).filter(([_, b]) => b.net > 0).map(([id, b]) => ({ id, amount: b.net }));

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      if (debtors[i].amount > creditors[j].amount) {
        settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: creditors[j].amount });
        debtors[i].amount -= creditors[j].amount;
        j++;
      } else {
        settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: debtors[i].amount });
        creditors[j].amount -= debtors[i].amount;
        i++;
      }
    }

    res.json({ balances, settlements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/members', async (req, res) => {
  try {
    const { user, name, email, avatar } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (group.owner.toString() !== req.userId) return res.status(403).json({ error: 'Only owner can add members' });

    group.members.push({ user, name, email, avatar });
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
