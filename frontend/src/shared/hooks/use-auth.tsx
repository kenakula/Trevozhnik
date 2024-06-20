import { authApi } from '@api/auth-api';
import { IUser } from '@shared/interfaces';
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface IUseAuthContext {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<IUser | null>;
  user: IUser | null;
}

const UseAuthContext = createContext<IUseAuthContext>({} as IUseAuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await authApi.login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const user = await authApi.signup(email, password);

      setUser(user);
    } catch (err) {
      setUser(null);
      console.error(err);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();

      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getUser = async (): Promise<IUser | null> => {
    try {
      const user = await authApi.getUser();
      setUser(user);

      return user;
    } catch (error) {
      setUser(null);
    }

    return null;
  };

  const value: IUseAuthContext = useMemo(() => ({
    user,
    login,
    logout,
    signup,
    getUser,
  }), [user]);

  return (
    <UseAuthContext.Provider value={value}>
      {children}
    </UseAuthContext.Provider>
  );
};

export const useAuth = (): IUseAuthContext => useContext<IUseAuthContext>(UseAuthContext);
