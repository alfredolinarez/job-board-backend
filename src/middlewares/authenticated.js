const database = require('../database');
const { Session, User } = database.models;

module.exports =
  (roles = []) =>
  async (req, res, next) => {
    if (req.user) return next();

    const [authType, token] = (req.headers.authorization || ' ').split(' ');
    const session = await Session.findByPk(token, {
      include: User,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'You need to be logged in to access this resource.',
        },
      });
    }

    if (Date.now() > Date.parse(session.expires)) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'You session has expired.',
        },
      });
    }

    req.user = session.User.toJSON();
    if (roles.length && !roles.includes(req.user.role_id)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'You are not allowed to perform this action.',
        },
      });
    }

    delete req.user.password;
    next();
  };
