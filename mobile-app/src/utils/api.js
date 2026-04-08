const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Standard fetch wrapper for Lifeline Connect
 * Automatically handles JWT injection and response unwrapping.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle relative vs absolute URLs
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, config);
    
    // Check if response is empty (e.g., 204 No Content)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    let friendlyMessage = error.message;

    // Handle Network Errors (TypeError: Failed to fetch)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      friendlyMessage = 'Server Unreachable (Mobile Bridge). Please check your internet connection or ADB bridge.';
    }

    console.error(`API Error [${endpoint}]:`, error);
    throw new Error(friendlyMessage);
  }
};

export default API_URL;
