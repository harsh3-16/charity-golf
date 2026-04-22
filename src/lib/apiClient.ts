import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A2 — Inject JWT Bearer token on every request.
// Uses a lazy import to avoid circular dependency issues with the store.
apiClient.interceptors.request.use(
  (config) => {
    // Dynamically import store at call-time (safe from circular dep)
    if (typeof window !== 'undefined') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { store } = require('@/store');
        const token = store.getState().auth.token as string | null;
        if (token) {
          config.headers = config.headers ?? {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        // store not yet initialised — proceed without token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A3 — Standardize errors and handle 401 globally.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = extractErrorMessage(error);

    // Clear session and redirect to login for 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export const extractErrorMessage = (error: unknown): string => {
  const e = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return (
    e.response?.data?.message ||
    e.response?.data?.error ||
    e.message ||
    'Something went wrong'
  );
};

export default apiClient;
