const database = require('../database');
const { Job } = database.models;
const { Router } = require('express');
const { roles } = require('../constants');
const authenticated = require('../middlewares/authenticated');

const router = Router();

router.get('/:id', async (req, res) => {
  const job = await Job.findByPk(req.params.id);

  res.json({
    success: true,
    data: job,
  });
});

router.post(
  '/',
  authenticated([roles.poster, roles.admin]),
  async (req, res) => {
    try {
      const job = await Job.create({
        ...req.body,
        status: 'open',
        publisher_id: req.user.id,
      });

      res.json({
        success: true,
        data: job,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: {
          message: error.message,
        },
      });
    }
  }
);

router.patch(
  '/:id',
  authenticated([roles.poster, roles.admin]),
  async (req, res) => {
    const job = await Job.findByPk(req.params.id);

    Object.assign(job, req.body);
    await job.save();

    res.json({
      success: true,
      data: job,
    });
  }
);

router.delete(
  '/:id',
  authenticated([roles.poster, roles.admin]),
  async (req, res) => {
    await Job.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
    });
  }
);

module.exports = router;
