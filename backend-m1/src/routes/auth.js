const express = require('express');
const bcrypt = require('bcrypt'); // Using bcrypt instead of bcryptjs since we installed it earlier
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const router = express.Router();

// POST /api/auth/register (seed a few users manually or via this route)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hashed, name, role },
    });
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
