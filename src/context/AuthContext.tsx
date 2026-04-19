import React, { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import type { ReadUser } from '@/types/user';

interface AuthContextType {
  user: ReadUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  // En mode mock 
  enableMock: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateur mocké pour le développement
const MOCK_USER: ReadUser = {
  id: 'dev-user-id',
  email: 'dev@local.test',
  username: 'devuser',
  last_name: 'Dev',
  first_name: 'User',
  bio: 'Développeur en test ah comment prendre pour faire ',
  avatar_url: null,
  sexe: 'M' as any,
  classe: { id: 'mock-class', name: 'L2 Génie Logiciel' },
  role: 'ADMIN',
  executive_role: null,
  can_post: true,
  access_jeton_id: null,
  is_verified: true,
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: null,
  last_login_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ReadUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  // Vérif si le mock est activé via le envlocal que j'ai creer juste pour tester 
  const isMockEnabledByEnv = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  const enableMock = () => {
    setUser(MOCK_USER);
    setUseMock(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  useEffect(() => {
    const loadUser = async () => {
      if (isMockEnabledByEnv || useMock) {
        console.log('🚧 Mode mock auth activé');
        setUser(MOCK_USER);
        localStorage.setItem('isAuthenticated', 'true');
        setIsLoading(false);
        return;
      }

      // Sinon leger on charge le profill
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
      } catch (error) {
        console.error('Non authentifié:', error);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [isMockEnabledByEnv, useMock]);

  const logout = () => {
    setUser(null);
    setUseMock(false);
    localStorage.removeItem('isAuthenticated');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    enableMock,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('message derreur pas dinspi');
  }
  return context;
};