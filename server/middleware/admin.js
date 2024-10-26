const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send({ error: 'Access denied. Admin rights required.' });
  }
};

module.exports = admin;
