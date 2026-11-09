import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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

interface AuthContextValue {
  session: User | null;
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ data: unknown; error: null } | { data: null; error: { message: string } }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('uasa_token');
      if (!token) { setLoading(false); return; }
      try {
        const data = await api.get('/auth/me');
        setUser(data.admin);
      } catch {
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
      return { data: null, error: { message: error?.message ?? String(error) } };
    }
  };

  const signOut = () => {
    localStorage.removeItem('uasa_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
