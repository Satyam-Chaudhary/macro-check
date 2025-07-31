import axios from 'axios';
import { useSessionStore } from '@/store/useSessionStore';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// This is an "interceptor" – a function that runs before every request.
apiClient.interceptors.request.use(
  (config) => {
    //get current session from zustand store
    const session = useSessionStore.getState().session;
    
    if (session?.access_token) {
      // If the token exists, we add it to the Authorization header.
      console.log(session.access_token)
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;