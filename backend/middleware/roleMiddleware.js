const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a student' });
  }
};

module.exports = { admin, student };