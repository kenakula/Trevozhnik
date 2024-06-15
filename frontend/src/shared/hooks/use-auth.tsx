import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface IUseAuthContext {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<any>;
  user: any;
}

const UseAuthContext = createContext<IUseAuthContext>({} as IUseAuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string): Promise<any | null> => {
    try {
      const user = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setUser(user);

      return user;
    } catch (error) {
      console.error(error);
    }

    return null;
  };

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const user = await fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setUser(user);
    } catch (err) {
      setUser(null);
      console.error(err);
    }
  };

  const logout = async (): Promise<void> => {
    console.log('logged out');
  };

  const getUser = async (): Promise<any> => {
    try {
      const data = await fetch('/auth/user').then(res => res.json());
      setUser(data.user);

      return data.user;
    } catch (error) {
      setUser(null);
    }
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
