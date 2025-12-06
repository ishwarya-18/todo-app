// API configuration for connecting to your Node.js backend on Render
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://todo-app-bzwv.onrender.com';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || data.message || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Network error. Make sure your backend server is running on localhost:5000' };
  }
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ message: string; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (name: string, email: string, password: string) => {
    return apiRequest<{ message: string; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
};

// Todos API
export interface Todo {
  id: number;
  task: string;
  completed: boolean;
  user_id: number;
}

export const todosApi = {
  getAll: async () => {
    return apiRequest<Todo[]>('/todos', { method: 'GET' });
  },

  create: async (title: string) => {
    return apiRequest<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  toggleComplete: async (taskId: number, completed: boolean) => {
    return apiRequest<Todo>(`/todos/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  delete: async (id: number) => {
    return apiRequest<{ message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API (Admin)
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export const usersApi = {
  getAll: async () => {
    return apiRequest<User[]>('/users', { method: 'GET' });
  },

  delete: async (userId: number) => {
    return apiRequest<{ message: string }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  },

  promote: async (userId: number) => {
    return apiRequest<{ message: string }>(`/users/${userId}/promote`, {
      method: 'PUT',
    });
  },
};
