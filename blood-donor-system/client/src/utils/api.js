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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export default API_URL;
