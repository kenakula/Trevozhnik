import { useAuth } from '@shared/hooks/use-auth';
import { ReactElement, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Footer } from './components/footer';
import { Header } from './components/header';

export const Layout = (): ReactElement => {
  const { getUser } = useAuth();
  const pathname = window.location.pathname;

  const navigate = useNavigate();

  const checkAuth = async (): Promise<void> => {
    const user = await getUser();

    if (!user) {
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </>
  );
};
