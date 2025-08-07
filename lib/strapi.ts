import axios from 'axios';
import Cookies from 'js-cookie';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
strapiClient.interceptors.request.use((config) => {
  const token = Cookies.get('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const auth = {
  async register(username: string, email: string, password: string) {
    try {
      const { data } = await strapiClient.post('/auth/local/register', {
        username,
        email,
        password,
      });
      Cookies.set('jwt', data.jwt, { expires: 30 });
      return { success: true, user: data.user, jwt: data.jwt };
    } catch (error) {
      const err = error as {response?: {data?: {error?: {message?: string}}}};
      return { success: false, error: err.response?.data?.error?.message || 'Registration failed' };
    }
  },

  async login(identifier: string, password: string) {
    try {
      const { data } = await strapiClient.post('/auth/local', {
        identifier,
        password,
      });
      Cookies.set('jwt', data.jwt, { expires: 30 });
      return { success: true, user: data.user, jwt: data.jwt };
    } catch (error) {
      const err = error as {response?: {data?: {error?: {message?: string}}}};
      return { success: false, error: err.response?.data?.error?.message || 'Login failed' };
    }
  },

  async logout() {
    Cookies.remove('jwt');
    window.location.href = '/';
  },

  async getMe() {
    try {
      const { data } = await strapiClient.get('/users/me');
      return { success: true, user: data };
    } catch {
      return { success: false, user: null };
    }
  },

  isAuthenticated() {
    return !!Cookies.get('jwt');
  }
};