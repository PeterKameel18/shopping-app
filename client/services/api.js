import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.0.2.2:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptors in React Native must be async for AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Fallback: no token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),
};

export const products = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
};

export const cart = {
  get: () => api.get("/cart"),
  add: (productId, quantity) => api.post("/cart/add", { productId, quantity }),
  update: (productId, quantity) =>
    api.put(`/cart/update/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete("/cart/clear"),
};

export const orders = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (shippingAddress, paymentIntentId) =>
    api.post("/orders", { shippingAddress, paymentIntentId }),
};

export const stripe = {
  createPaymentIntent: (amount) =>
    api.post("/create-payment-intent", { amount }),
};

export default api;
