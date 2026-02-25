import {
  verifyUserCredentials,
  changePassword,
  createUser,
} from '../services/userServive.js';

import {
  postUserSchema,
  changePasswordSchema,
} from '../validators/userSchema.js';

import TokenManajer from '../tokenize/tokenManajer.js';

import {
  createToken,
  verifyToken,
  deleteToken,
  deleteTokenByUserId,
} from '../services/authService.js';

import 'dotenv/config';

export const userLoggedInController = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', message: 'User logged in' });
  } catch (error) {
    next(error);
  }
};

export const postUserController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = postUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    const user = await createUser(username, password);
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Username sudah digunakan',
      });
    }
    res.status(201).json({ status: 'success', message: 'User created' });
  } catch (error) {
    next(error);
  }
};

export const postAuthController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error } = postUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    const user = await verifyUserCredentials(username, password);
    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Invalid username or password' });
    }
    const refreshToken = TokenManajer.generateRefreshToken({
      id: user.id,
      username,
    });
    const accessToken = TokenManajer.generateAccessToken({
      id: user.id,
      username,
    });

    await deleteTokenByUserId(user.id);
    await createToken(refreshToken, user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.IS_PROD === 'true' ? true : false,
      sameSite: process.env.IS_PROD === 'true' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ status: 'success', accessToken });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    const { username } = req.user;
    const result = await changePassword(
      username,
      oldPassword,
      newPassword,
      confirmPassword,
    );
    if (!result) {
      return res.status(400).json({
        status: 'error',
        message: 'Password lama salah atau password baru tidak sesuai',
      });
    }
    res
      .status(200)
      .json({ status: 'success', message: 'Password berhasil diubah' });
  } catch (error) {
    next(error);
  }
};

export const putAuthController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token tidak ditemukan',
      });
    }

    const isValidToken = await verifyToken(refreshToken);
    if (!isValidToken) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Refresh token tidak terdaftar' });
    }
    const { id, username } = TokenManajer.verifyRefreshToken({ refreshToken });
    const newAccessToken = TokenManajer.generateAccessToken({ id, username });

    res.status(200).json({ status: 'success', accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const deleteAuthController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token tidak ditemukan',
      });
    }

    await deleteToken(refreshToken);

    res.clearCookie('refreshToken');

    res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
    });
  } catch (error) {
    next(error);
  }
};
