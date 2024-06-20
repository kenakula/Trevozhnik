import { useAuth } from '@shared/hooks/use-auth';
import { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = (): ReactElement => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
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
      {' '}
      <Link to="/profile">profile</Link>

      <br/>

      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
