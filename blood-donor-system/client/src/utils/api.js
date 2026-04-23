const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Standard fetch wrapper for Lifeline Connect
 * Automatically handles JWT injection and response unwrapping.
 */
export const apiRequest = async (endpoint, options = {}, retries = 5) => {
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

  console.log(`[API Call] [${new Date().toISOString()}] Calling: ${url}`, { method: config.method || 'GET' });

  try {
    const response = await fetch(url, config);
    
    // Check if response is empty (e.g., 204 No Content)
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      console.error(`[API Error Response] [${endpoint}] Status: ${response.status}`, data);
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Implement Cold Start Retry Logic for sleeping servers
    const isNetworkError = error instanceof TypeError && (
      error.message.includes('fetch') || 
      error.message.includes('NetworkError') || 
      error.message.includes('Failed to fetch') ||
      error.message.includes('network error')
    );
    
    if (retries > 0 && isNetworkError) {
      // 5 retries: 2s, 4s, 6s, 8s, 10s = ~30s total delay
      const delay = (6 - retries) * 2000; 
      console.warn(`[Cold Start Detection] Server unreachable, retrying ${endpoint} (${retries} left) in ${delay}ms...`, error.message);
      await new Promise(res => setTimeout(res, delay));
      return apiRequest(endpoint, options, retries - 1);
    }
    
    let friendlyMessage = error.message;

    // Handle Network Errors
    if (isNetworkError) {
      friendlyMessage = `Server Unreachable at ${url}. The server might be waking up or your connection is unstable. Please wait 30s and try again.`;
    }

    console.error(`[API Final Failure] [${endpoint}]:`, error);
    throw new Error(friendlyMessage);
  }
};

export default API_URL;
