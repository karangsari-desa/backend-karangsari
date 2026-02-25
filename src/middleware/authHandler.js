import TokenManager from '../tokenize/tokenManajer.js';

export const authHandler = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const payload = TokenManager.verifyAccessToken({ accessToken: token });
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
