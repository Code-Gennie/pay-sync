// TypeScript interfaces for the billing system

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface Customer {
  id: string;
  accountNo: string;
  name: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Item {
  id: string;
  itemId: string;
  name: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bill {
  id: string;
  billNo: string;
  customerId: string;
  customer?: Customer;
  items: BillItem[];
  totalAmount: number;
  tax?: number;
  finalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';
  createdAt: string;
  dueDate?: string;
}

export interface BillItem {
  id: string;
  itemId: string;
  item?: Item;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Report {
  totalSales: number;
  totalBills: number;
  pendingAmount: number;
  paidAmount: number;
  recentBills: Bill[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}