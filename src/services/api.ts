import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, User, Customer, Item, Bill, Report } from '@/types';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await this.api.get('/customers');
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.post('/customers', customer);
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.put(`/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }

  // Items
  async getItems(): Promise<Item[]> {
    const response: AxiosResponse<Item[]> = await this.api.get('/items');
    return response.data;
  }

  async getItem(id: string): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.get(`/items/${id}`);
    return response.data;
  }

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.post('/items', item);
    return response.data;
  }

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.put(`/items/${id}`, item);
    return response.data;
  }

  async deleteItem(id: string): Promise<void> {
    await this.api.delete(`/items/${id}`);
  }

  // Bills
  async getBills(): Promise<Bill[]> {
    const response: AxiosResponse<Bill[]> = await this.api.get('/bills');
    return response.data;
  }

  async getBill(id: string): Promise<Bill> {
    const response: AxiosResponse<Bill> = await this.api.get(`/bills/${id}`);
    return response.data;
  }

  async createBill(bill: Omit<Bill, 'id'>): Promise<Bill> {
    const response: AxiosResponse<Bill> = await this.api.post('/bills', bill);
    return response.data;
  }

  async updateBill(id: string, bill: Partial<Bill>): Promise<Bill> {
    const response: AxiosResponse<Bill> = await this.api.put(`/bills/${id}`, bill);
    return response.data;
  }

  async deleteBill(id: string): Promise<void> {
    await this.api.delete(`/bills/${id}`);
  }

  // Reports
  async getReports(): Promise<Report> {
    const response: AxiosResponse<Report> = await this.api.get('/reports');
    return response.data;
  }
}

export const apiService = new ApiService();