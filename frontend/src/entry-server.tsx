import '@fontsource/inter';

import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { AuthProvider } from '@shared/hooks/use-auth';
import type * as express from 'express';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { routes } from './router';

export function createFetchRequest(request: express.Request): Request {
  const origin = `${request.protocol}://${request.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(request.originalUrl || request.url, origin);

  const controller = new AbortController();
  request.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(request.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    signal: controller.signal,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body;
  }

  return new Request(url.href, init);
}

export async function render(request: express.Request) {
  const { query, dataRoutes } = createStaticHandler(routes);
  const fetchRequest: Request = createFetchRequest(request);
  const context = await query(fetchRequest);

  // If we got a redirect response, short circuit and let our Express server
  // handle that directly
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <CssVarsProvider>
        <CssBaseline/>
        <AuthProvider>
          <StaticRouterProvider
            router={router}
            context={context}
            nonce="the-nonce"
          />
        </AuthProvider>
      </CssVarsProvider>
    </React.StrictMode>
  );

  return { html };
}
