/**
 * Standardized response format for all API endpoints.
 * @param {boolean} success - Whether the operation was successful.
 * @param {string} message - A description of the result.
 * @param {any} data - The actual data to be returned.
 * @returns {object} - Standardized response object.
 */
export const sendResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
  };
};

/**
 * Helper for successful responses.
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json(sendResponse(true, message, data));
};

/**
 * Helper for error responses.
 */
export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json(sendResponse(false, message, null));
};
