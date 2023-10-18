import axios from "axios";
import { getFirebaseUserToken } from "./auth-service";

const buildApiClientWithAuth = () => {
  const instance = axios.create();

  instance.interceptors.request.use(async (config) => {
    const token = await getFirebaseUserToken();
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return instance;
};

export const apiClientWithAuth = buildApiClientWithAuth();
