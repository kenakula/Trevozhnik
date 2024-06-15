import '@fontsource/inter';
import './style.css';

import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { AuthProvider } from '@shared/hooks/use-auth';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider, } from 'react-router-dom';

import { routes } from './router';

async function hydrate() {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      })
    );
  }

  const router = createBrowserRouter(routes);

  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
      <CssVarsProvider>
        <CssBaseline/>
        <AuthProvider>
          <RouterProvider
            router={router}
            fallbackElement={<div>This is the fallbackElement</div>}
          />
        </AuthProvider>
      </CssVarsProvider>
    </React.StrictMode>
  );
}

hydrate();
