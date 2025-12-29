import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/helper';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include session in all requests
apiClient.interceptors.request.use(async config => {
  try {
    const sessionJwt = await AsyncStorage.getItem('sessionJwt');
    if (sessionJwt) {
      config.headers.Cookie = `session=${sessionJwt}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default apiClient;
