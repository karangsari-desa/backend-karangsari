import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../services/newService.js';

import fs from 'fs';
import path from 'path';

import { postNewSchema, putNewSchema } from '../validators/newSchema.js';

const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;

  let imagePath = imageUrl;

  // Jika full URL, ambil pathname saja
  if (imagePath.startsWith('http')) {
    const urlObj = new URL(imagePath);
    imagePath = urlObj.pathname.slice(1); // hapus "/" depan
  }

  // Jangan hapus default image
  if (imagePath === 'uploads/default.jpg') return;

  const fullPath = path.resolve(imagePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const getAllNewsController = async (req, res, next) => {
  try {
    const news = await getAllNews();
    res.status(200).json({ status: 'success', data: news });
  } catch (error) {
    next(error);
  }
};

export const getNewsByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await getNewsById(id);

    if (!news) {
      return res
        .status(404)
        .json({ status: 'error', message: 'News not found' });
    }

    res.status(200).json({ status: 'success', data: news });
  } catch (error) {
    next(error);
  }
};

export const createNewsController = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const { id: user_id } = req.user;

    const { error } = postNewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const img = req.file
      ? `${baseUrl}/uploads/${req.file.filename}`
      : `${baseUrl}/uploads/default.jpg`;

    const news = await createNews(user_id, img, title, body);

    res.status(201).json({
      status: 'success',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNewsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const { id: user_id } = req.user;

    const { error } = putNewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    const existing = await getNewsById(id);

    if (!existing) {
      return res
        .status(404)
        .json({ status: 'error', message: 'News not found' });
    }

    let img = existing.img;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Jika upload gambar baru
    if (req.file) {
      deleteImageFile(existing.img); // hapus gambar lama
      img = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const news = await updateNews(id, user_id, img, title, body);

    res.status(200).json({
      status: 'success',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await getNewsById(id);

    if (!existing) {
      return res
        .status(404)
        .json({ status: 'error', message: 'News not found' });
    }

    deleteImageFile(existing.img);

    await deleteNews(id);

    res.status(200).json({
      status: 'success',
      message: 'News deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
