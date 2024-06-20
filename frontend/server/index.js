import fs from 'node:fs/promises';

import express from 'express';
import morgan from 'morgan';
import { Account, Client } from 'node-appwrite';
import { loadEnv } from 'vite';

import { loginHandler, logoutHandler, signupHandler, userHandler } from './handlers.js';
import { cookieParser } from './middlewares.js';

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd()) };

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5173;
const BASE_URL = process.env.BASE || '/';
const PUBLIC_URLS = ['login', 'signup', '500', '404'];
const LOGIN_URL = '/auth/login';
const LOGOUT_URL = '/auth/logout';
const SIGNUP_URL = '/auth/signup';
const AUTHED_USER_URL = '/auth/user';

// Cached production assets
const templateHtml = IS_PRODUCTION
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : '';

// const ssrManifest = IS_PRODUCTION
//     ? await fs.readFile('./dist/client/ssr-manifest.json', 'utf-8')
//     : undefined;


const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser);

let vite;

if (!IS_PRODUCTION) {
    const { createServer } = await import('vite');

    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base: BASE_URL
    });

    app.use(vite.middlewares);
} else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());
    app.use(BASE_URL, sirv('./dist/client', { extensions: [] }));
}

app.post(LOGIN_URL, loginHandler);
app.post(SIGNUP_URL, signupHandler);
app.get(LOGOUT_URL, logoutHandler);
app.get(AUTHED_USER_URL, userHandler);

app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl.replace(BASE_URL, '');

        let template;
        let render;

        if (!IS_PRODUCTION) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
        } else {
            template = templateHtml;
            render = (await import('../dist/server/entry-server.js')).render;
        }

        const rendered = await render(req);

        const client = new Client()
            .setEndpoint(process.env.VITE_ENDPOINT)
            .setProject(process.env.VITE_PROJECT_ID);

        const session = req.cookies?.['session'];

        const shouldRedirectToLogin = !session && !PUBLIC_URLS.includes(url) && req.originalUrl !== '/';

        if (shouldRedirectToLogin) {
            console.error(`INFO ${new Date().toLocaleString()}: Private page. Redirecting to login page`);
            return res.status(302).redirect('/login');
        }

        if (session) {
            client.setSession(session);

            const account = new Account(client);

            try {
                await account.get();
            } catch (e) {
                console.error(`ERROR ${new Date().toLocaleString()}: Not Authenticated! Redirecting to login page`);
                return res.status(302).redirect('/login');
            }
        }

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '');

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
        vite?.ssrFixStacktrace(e);
        console.error(e.stack);
        res.status(500).end(e.stack);
    }
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
