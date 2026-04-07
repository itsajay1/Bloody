import Request from '../models/Request.js';
import { createBloodRequestWithNotifications } from '../services/requestService.js';
import { successResponse } from '../utils/responseWrapper.js';

// @desc    Get all blood requests
// @route   GET /api/request
// @access  Public
const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({});
    successResponse(res, 'Requests fetched successfully', requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Get blood request by ID
// @route   GET /api/request/:id
// @access  Public
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (request) {
      successResponse(res, 'Request fetched successfully', request);
    } else {
      res.status(404);
      throw new Error('Request not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create blood request and find matching donors within 10km
// @route   POST /api/request
// @access  Public
const createRequest = async (req, res, next) => {
  try {
    const { bloodGroup, location } = req.body;

    if (!bloodGroup || !location || location.lat === undefined || location.lng === undefined) {
      res.status(400);
      throw new Error('Please provide bloodGroup and location (lat, lng)');
    }

    const data = await createBloodRequestWithNotifications({ bloodGroup, location });

    successResponse(res, 'Blood request created successfully', data, 201);
  } catch (error) {
    next(error);
  }
};

export { getRequests, getRequestById, createRequest };

