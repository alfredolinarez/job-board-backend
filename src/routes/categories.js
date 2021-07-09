const database = require('../database');
const { Config, Job, Category } = database.models;
const { Router } = require('express');
const { Op } = require('sequelize');
const authenticated = require('../middlewares/authenticated');
const { roles } = require('../constants');

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Category.findAll({
        order: [['id', 'DESC']],
      }),
    });
  } catch (err) {
    res.json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }
});

router.post('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: await Category.create(req.body),
    });
  } catch (err) {
    res.json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }
});

router.get(['/:slug/', '/:slug/:page'], async (req, res) => {
  const config = await Config.findOne();
  const jobs_per_page = Number.parseInt(config.jobs_per_page) || 20;

  const category = await Category.findOne({
    where: {
      slug: req.params.slug,
    },
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Category not found',
      },
    });
  }

  const query = {
    category_id: category.id,
  };

  const search = database.escape(req.query.search || '').slice(1, -1);
  if (search) {
    query[Op.or] = [
      {
        company: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        position: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        location: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
  }

  const jobsCount = await Job.count({
    where: query,
  });
  const jobs = await Job.findAll({
    where: query,
    limit: jobs_per_page,
    offset:
      jobs_per_page * Math.max((Number.parseInt(req.params.page) || 1) - 1, 0),
    order: [['created_at', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      ...category.toJSON(),
      jobs,
    },
    total: jobsCount,
    pages:
      Math.floor(jobsCount / jobs_per_page) +
      (jobsCount % jobs_per_page === 0 ? 0 : 1),
  });
});

router.patch('/:slug', authenticated([roles.admin]), async (req, res) => {
  const category = await Category.findOne({
    where: {
      slug: req.params.slug,
    },
  });

  if (category) {
    Object.assign(category, req.body);
    await category.save();
  }

  res.json({
    success: true,
    data: category,
  });
});

router.delete('/:slug', authenticated([roles.admin]), async (req, res) => {
  const category = await Category.findOne({
    where: {
      slug: req.params.slug,
    },
  });

  if (category) {
    await Job.destroy({
      where: {
        category_id: category.id,
      },
    });
    await category.destroy();
  }

  res.json({
    success: true,
  });
});

module.exports = router;
