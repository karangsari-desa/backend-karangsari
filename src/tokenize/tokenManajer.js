import jwt from 'jsonwebtoken';
import 'dotenv/config';

const TokenManager = {
  generateAccessToken: (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '15m',
    });
    return accessToken;
  },

  generateRefreshToken: (payload) => {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: '7d',
    });
    return refreshToken;
  },

  verifyRefreshToken: ({ refreshToken }) => {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Refresh token expired');
        err.statusCode = 403;
        throw err;
      }

      const err = new Error('Refresh token tidak valid');
      err.statusCode = 401;
      throw err;
    }
  },

  verifyAccessToken: ({ accessToken }) => {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const err = new Error('Access token expired');
        err.statusCode = 401;
        throw err;
      }

      const err = new Error('Access token tidak valid');
      err.statusCode = 400;
      throw err;
    }
  },
};

export default TokenManager;
