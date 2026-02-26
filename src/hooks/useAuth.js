import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há usuário no localStorage ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao restaurar usuário:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Validação básica
    if (!email || !password) {
      return { success: false, error: 'Email e senha são obrigatórios' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Email inválido' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Senha deve ter no mínimo 6 caracteres' };
    }

    // Simula login - em um app real, faria uma chamada a API
    const userData = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      loginTime: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const register = (email, password, confirmPassword) => {
    // Validração
    if (!email || !password || !confirmPassword) {
      return { success: false, error: 'Todos os campos são obrigatórios' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Email inválido' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Senha deve ter no mínimo 6 caracteres' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'As senhas não conferem' };
    }

    // Simula registro
    const userData = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      loginTime: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
