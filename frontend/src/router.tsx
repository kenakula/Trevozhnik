import { ErrorBoundary } from '@components/error-boundary';
import { Layout } from '@components/layout';
import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout/>,
    errorElement: <ErrorBoundary/>,
    children: [
      {
        path: 'dashboard',
        lazy: () => import('@pages/dashboard')
      },
      {
        path: 'profile',
        lazy: () => import('@pages/profile')
      },
    ]
  },
  {
    index: true,
    lazy: () => import('@pages/home')
  },
  {
    path: 'login',
    lazy: () => import('@pages/login')
  },
  {
    path: 'signup',
    lazy: () => import('@pages/signup')
  },
];

