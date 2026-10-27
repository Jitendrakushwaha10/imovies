import { Theatre } from '../models/Theatre.js';
import { Show } from '../models/Show.js';

export const getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: theatres.length,
      theatres
    });
  } catch (error) {
    next(error);
  }
};

export const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.'
      });
    }
    res.status(200).json({
      success: true,
      theatre
    });
  } catch (error) {
    next(error);
  }
};

export const createTheatre = async (req, res, next) => {
  try {
    const { name, city, address, screens, rows, cols } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name and address are required.'
      });
    }

    const theatre = await Theatre.create({
      name: name.trim(),
      city: city || 'Indore',
      address: address.trim(),
      screens: screens ? Number(screens) : 4,
      seatLayout: {
        rows: rows ? Number(rows) : 8,
        cols: cols ? Number(cols) : 10,
        rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      }
    });

    res.status(201).json({
      success: true,
      message: 'Theatre added successfully.',
      theatre
    });
  } catch (error) {
    next(error);
  }
};

export const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully.',
      theatre
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTheatre = async (req, res, next) => {
  try {
    const showsCount = await Show.countDocuments({ theatre: req.params.id });
    if (showsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete theatre: It has ${showsCount} associated showtime(s).`
      });
    }

    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
