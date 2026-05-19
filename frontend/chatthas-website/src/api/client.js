/**
 * Reusable API Client Layer
 * Prepared for future backend integration (Axios/Fetch interceptors can be added here)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; // Default to /api for proxy or relative routes

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
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid API response (${response.status})`);
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `API request failed (${response.status})`);
  }

  return data ?? {};
}
