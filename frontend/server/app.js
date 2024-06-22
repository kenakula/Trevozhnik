import fs from 'node:fs/promises';

import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import { Account, Client } from 'node-appwrite';
import * as sirv from 'sirv';
import { createServer } from 'vite';
import { loadEnv } from 'vite';

import { cookieParser } from './middlewares/cookie-parser.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd()) };

const PUBLIC_URLS = ['/login', '/signup', '/500', '/404', '/'];

const templateHtml = process.env.NODE_ENV === 'production'
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : '';

export class App {
    _app;
    _port;
    _env;
    _baseUrl;
    _viteInstance;

    constructor(routes) {
        this._app = express();
        this._env = process.env.NODE_ENV || 'development';
        this._port = process.env.VITE_PORT || 3000;
        this._baseUrl = process.env.VITE_BASE || '/';

        this.initMiddlewares();
        this.initVite().then(() => {
            this.initSsr();
        });

        this.initRoutes(routes);
    }

    get isProduction() {
        return this._env === 'production';
    }

    async initVite() {
        if (!this.isProduction) {
            this._viteInstance = await createServer({
                server: { middlewareMode: true },
                appType: 'custom',
                base: this._baseUrl,
            });

            this._app.use(this._viteInstance.middlewares);
        } else {
            this._app.use(compression());
            this._app.use(this._baseUrl, sirv('./dist/client', { extensions: [] }));
        }
    }

    initMiddlewares() {
        this._app.use(express.json());
        this._app.use(morgan('dev'));
        this._app.use(cookieParser);
        this._app.use(errorMiddleware);
    }

    initSsr() {
        this._app.use('*', async (req, res) => {
            try {
                const url = req.originalUrl.replace(this._baseUrl, '');

                let template;
                let render;

                if (!this.isProduction) {
                    template = await fs.readFile('./index.html', 'utf-8');
                    template = await this._viteInstance.transformIndexHtml(url, template);
                    render = (await this._viteInstance.ssrLoadModule('/src/entry-server.tsx')).render;
                } else {
                    template = templateHtml;
                    render = (await import('../dist/server/entry-server.js')).render;
                }

                const isAuthed = await this.handleAuth(req);

                if (!isAuthed) {
                    return res.status(401).redirect('/login');
                }

                const rendered = await render(req);

                const html = template
                    .replace(`<!--app-head-->`, rendered.head ?? '')
                    .replace(`<!--app-html-->`, rendered.html ?? '');

                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } catch (error) {
                res.status(500).set({ 'Content-Type': 'text/html' }).end(error);
            }
        });
    }

    async handleAuth(req) {
        const client = new Client()
            .setEndpoint(process.env.VITE_ENDPOINT)
            .setProject(process.env.VITE_PROJECT_ID);

        const session = req.cookies?.['session'];

        const shouldRedirectToLogin = !session && !PUBLIC_URLS.includes(req.originalUrl);

        if (shouldRedirectToLogin) {
            console.error(
                `ERROR ${new Date().toLocaleString()}: Private page. Redirecting to login page: `, req.originalUrl
            );

            return false;
        }

        if (session) {
            client.setSession(session);

            const account = new Account(client);

            try {
                await account.get();

                return true;
            } catch (error) {
                console.error(`ERROR ${new Date().toLocaleString()}: Not Authenticated! Redirecting to login page`);

                return false;
            }
        }

        return true;
    }

    initRoutes(routes) {
        routes.forEach((route) => {
            this._app.use(`${this._baseUrl}`, route.router);
        });
    }

    listen() {
        const server = this._app.listen(this._port, () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this._env} =======`);
            console.info(`App listening on the port: ${this._port} 🚀 `);
            console.info(`=================================`);
        });

        process.on('unhandledRejection', (err) => {
            console.error(err.name, err.message);
            console.info('UNHANDLED REJECTION 💥 SHUTTING DOWN...');

            server.close(() => {
                process.exit(1);
            });
        });
    }
}
