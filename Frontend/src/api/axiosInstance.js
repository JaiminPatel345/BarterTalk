import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: false, // not using cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Debug logging (remove in production if needed)
    if (import.meta.env.DEV) {
      console.log(`🔵 ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log the error for debugging
    if (error.response) {
      // Server responded with error status
      console.error('❌ Response Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });

      // Handle 401 - Unauthorized (expired token)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // Don't redirect here - let components handle it
      }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network Error:', {
        url: error.config?.url,
        message: 'No response received from server',
      });
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 