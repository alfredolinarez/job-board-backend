const { Router } = require('express');
const { Sequelize, Op } = require('sequelize');
const database = require('../database');
const { Config, Category } = database.models;

const router = Router();

router.use('/config', require('./config'));
router.use('/auth', require('./auth'));
router.use('/jobs', require('./jobs'));
router.use('/categories', require('./categories'));
router.get('/board', async (req, res) => {
  const config = await Config.findOne();
  const search = database.escape(req.query.search || '').slice(1, -1);
  const searchString = search
    ? ' AND ' +
      [
        `job.company LIKE '%${search}%'`,
        `job.position LIKE '%${search}%'`,
        `job.location LIKE '%${search}%'`,
      ].join(' OR ')
    : '';

  const [jobs] = await database.query(
    `SELECT *
    FROM (
             SELECT ROW_NUMBER() over (PARTITION BY category_id ORDER BY created_at DESC) AS row_num, job.*
             FROM job_board.jobs job
             WHERE job.status = 'open'
             ${searchString}
         ) job
    WHERE job.row_num <= ${config.board_jobs_count}
    ORDER BY category_id ASC
    ;`
  );

  const categoryIds = jobs.reduce((acc, val) => {
    if (!acc.includes(val.category_id)) {
      acc.push(val.category_id);
    }
    return acc;
  }, []);

  const categories = await Category.findAll({
    where: {
      id: {
        [Op.in]: categoryIds,
      },
    },
  });

  res.json({
    success: true,
    data: categories.map((category) => ({
      ...category.toJSON(),
      jobs: jobs
        .filter((job) => job.category_id === category.id)
        .map((job) => ({ ...job, row_num: undefined })),
    })),
  });
});

module.exports = router;
