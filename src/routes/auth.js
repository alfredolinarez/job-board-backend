const database = require('../database');
const { User } = database.models;
const { Router } = require('express');
const { authenticateUser } = require('../services/auth');
const authenticated = require('../middlewares/authenticated');

const router = Router();

router.post('/login', async (req, res) => {
  const { username = '', password = '' } = req.body;
  try {
    res.json({
      success: true,
      data: await authenticateUser(username, password),
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }
});

router.post('/register', async (req, res) => {
  const existingUsername = await User.findOne({
    where: { username: req.body.username },
  });
  const existingEmail = await User.findOne({
    where: { email: req.body.email },
  });

  if (existingUsername) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'That username is already being used',
      },
    });
  }

  if (existingEmail) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'That email is already being used',
      },
    });
  }

  await User.create(req.body);
  res.json({
    success: true,
    data: await authenticateUser(req.body.username, req.body.password),
  });
});

router.get('/me', authenticated(), (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
