import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeJwt, isTokenExpired } from '@/lib/jwt';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        // Token expired, clear it
        localStorage.removeItem('token');
        setIsLoading(false);
        return;
      }

      const payload = decodeJwt(storedToken);
      if (payload) {
        setToken(storedToken);
        setUser({
          id: payload.userId,
          email: '', // Email not stored in JWT
          name: '', // Name not stored in JWT
          role: payload.role,
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    const payload = decodeJwt(newToken);
    if (payload) {
      setToken(newToken);
      setUser({
        id: payload.userId,
        email: '',
        name: '',
        role: payload.role,
      });
      localStorage.setItem('token', newToken);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
