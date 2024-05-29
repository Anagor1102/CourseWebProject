import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { username, password } = JSON.parse(storedUser);
      axios.post('/users/authenticate', null, {
        params: { username, password }
      }).then(response => {
        setUser(response.data);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('user');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/users/authenticate', null, {
        params: { username, password }
      });
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify({ username, password }));
      navigate('/account');
    } catch (error) {
      console.error('Ошибка входа', error);
      alert('Введены неверные данные.');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Загрузка...</div>; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Использование авторизации должно взаимодействовать с провайдером.');
  }
  return context;
};