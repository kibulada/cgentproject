const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
}; 