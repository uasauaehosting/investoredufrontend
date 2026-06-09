import { useState, useEffect } from 'react';
import { api } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('uasa_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        setUser(data.admin);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('uasa_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('uasa_token', data.token);
      setUser(data.admin);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('uasa_token');
    setUser(null);
  };

  return { user, session: user, loading, signIn, signOut };
}
