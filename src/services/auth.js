const database = require('../database');
const { User, Session } = database.models;
const { compare } = require('bcrypt');
const { nanoid } = require('nanoid');

async function authenticateUser(username, password) {
  const query = {};

  if (username.includes('@')) {
    query.email = username;
  } else {
    query.username = username;
  }

  const user = await User.findOne({
    where: query,
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!(await compare(password, user.password))) {
    throw new Error('Invalid login credentials');
  }

  return await generateToken(user.id);
}

async function generateToken(userId) {
  const token = nanoid();
  const session = await Session.create({
    token,
    user_id: userId,
    expires: Date.now() + 60 * 60 * 1000,
  });
  session.user_id = userId;
  await session.save();
  return session;
}

module.exports = {
  authenticateUser,
};
