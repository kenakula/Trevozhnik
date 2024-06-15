import { useAuth } from '@shared/hooks/use-auth';
import { ReactElement, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Footer } from './components/footer';
import { Header } from './components/header';

export const Layout = (): ReactElement => {
  const authChecked = useRef<boolean>(false);
  const { user, getUser } = useAuth();

  const navigate = useNavigate();

  const checkAuth = async (): Promise<void> => {
    if (authChecked.current) return;

    authChecked.current = true;
    const user = await getUser();

    if (!user) {
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Header/>
      <p>{JSON.stringify(user)}</p>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
};
