const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'englishclass_super_secret_2024';

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена авторизации' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.teacher = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Токен недействителен или истёк' });
  }
};
