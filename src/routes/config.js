const database = require('../database');
const { Config } = database.models;
const { Router } = require('express');
const authenticated = require('../middlewares/authenticated');
const { roles } = require('../constants');

const router = Router();

router.get('/', authenticated([roles.admin]), async (req, res) => {
  const config = await Config.findOne();

  res.json({
    success: true,
    data: config,
  });
});

router.patch('/', authenticated([roles.admin]), async (req, res) => {
  try {
    const config = await Config.findOne();

    Object.assign(config, req.body);
    await config.save();

    res.json({
      success: true,
      data: config,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
});

module.exports = router;
