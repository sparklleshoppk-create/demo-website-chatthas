/**
 * Reusable API Client Layer
 * Prepared for future backend integration (Axios/Fetch interceptors can be added here)
 */

const API_BASE_URL = '/api'; // Using proxy defined in vite.config.js

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Future: Add JWT token fetching here
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}
