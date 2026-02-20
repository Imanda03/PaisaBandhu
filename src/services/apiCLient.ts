import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/helper';
import { triggerLogout } from './authCallback';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include session in all requests
apiClient.interceptors.request.use(
  async config => {
    try {
      const sessionJwt = await AsyncStorage.getItem('sessionJwt');
      if (sessionJwt) {
        config.headers.Cookie = `session=${sessionJwt}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => Promise.reject(error),
);

const MAX_429_RETRIES = 2;
const MAX_5XX_RETRIES = 2;
const DEFAULT_429_DELAY_MS = 2000;
const DEFAULT_5XX_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add response interceptor: 401/400 -> logout; 429/502/503/504 -> retry with backoff
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    const config = error?.config;

    if (status === 401) {
      await triggerLogout();
      return Promise.reject(error);
    }

    // 429 Too Many Requests: retry with backoff
    if (status === 429 && config) {
      config.__429RetryCount = (config.__429RetryCount || 0) + 1;
      if (config.__429RetryCount <= MAX_429_RETRIES) {
        const retryAfter = error?.response?.headers?.['retry-after'];
        const delayMs = retryAfter
          ? Math.min(parseInt(retryAfter, 10) * 1000, 10000)
          : DEFAULT_429_DELAY_MS * config.__429RetryCount;
        await sleep(delayMs);
        return apiClient.request(config);
      }
    }

    // 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout: retry (often transient)
    const is5xxRetryable = status === 502 || status === 503 || status === 504;
    if (is5xxRetryable && config) {
      config.__5xxRetryCount = (config.__5xxRetryCount || 0) + 1;
      if (config.__5xxRetryCount <= MAX_5XX_RETRIES) {
        const delayMs = DEFAULT_5XX_DELAY_MS * config.__5xxRetryCount;
        await sleep(delayMs);
        return apiClient.request(config);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
