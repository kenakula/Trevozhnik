import { useAuth } from '@shared/hooks/use-auth';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export const Header = (): ReactElement => {
  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  return (
    <div>
      <Link to="/">HOME</Link>
      {' '}
      <Link to="/dashboard">Dashboard</Link>
      {' '}
      <Link to="/login">login</Link>
      {' '}
      <Link to="/signup">signup</Link>

      <br/>

      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
