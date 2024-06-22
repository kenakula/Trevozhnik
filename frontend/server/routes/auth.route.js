import express from 'express';
import { Account, Client, ID } from 'node-appwrite';
import { loadEnv } from 'vite';

import { ResponseModel } from '../models/response.model.js';

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd()) };

export class AuthRoute {
    path = '/auth';
    router;

    constructor() {
        this.router = express.Router();

        this.init();
    }

    init() {
        this.router.get(`${this.path}/user`, async (req, res) => {
            const session = req.cookies?.session;

            if (!session) {
                return res.status(401).json(new ResponseModel(false, 'Not Authorized', null));
            }

            const client = new Client()
                .setEndpoint(process.env.VITE_ENDPOINT)
                .setProject(process.env.VITE_PROJECT_ID);

            client.setSession(session);

            const account = new Account(client);

            try {
                const user = await account.get();

                res.status(200).json(new ResponseModel(true, 'Success', user));
            } catch (e) {
                res.status(401).json(new ResponseModel(false, 'Not Authorized', null));
            }
        });

        this.router.post(`${this.path}/login`, async (req, res) => {
            if (!req.body) {
                return res.status(400).send(new ResponseModel(false, 'No body in request', null));
            }

            const { email, password } = req.body;

            const client = new Client()
                .setEndpoint(process.env.VITE_ENDPOINT)
                .setProject(process.env.VITE_PROJECT_ID)
                .setKey(process.env.VITE_API_KEY);

            const account = new Account(client);

            try {
                const session = await account.createEmailPasswordSession(email, password);

                res.cookie('session', session.secret, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: new Date(session.expire).getTime(),
                    path: '/',
                });

                res.status(200).json(new ResponseModel(true, 'Successfully logged in', null));
            } catch (err) {
                res.status(401).json(new ResponseModel(false, 'Invalid credentials', null));
            }
        });

        this.router.post(`${this.path}/signup`, async (req, res) => {
            if (!req.body) {
                return res.status(400).send(new ResponseModel(false, 'No body in request', null));
            }

            const { email, password } = req.body;

            const client = new Client()
                .setEndpoint(process.env.VITE_ENDPOINT)
                .setProject(process.env.VITE_PROJECT_ID)
                .setKey(process.env.VITE_API_KEY);

            const account = new Account(client);

            try {
                const user = await account.create(ID.unique(), email, password);
                res.status(201).json(new ResponseModel(true, 'User created', user));
            } catch (err) {
                console.error(err);
                res.status(400).json(new ResponseModel(false, err.message, null));
            }
        });

        this.router.get(`${this.path}/logout`, async (req, res) => {
            const session = req.cookies?.['session'];

            if (!session) {
                return res.status(401).json(new ResponseModel(false, 'Not Authorized', null));
            }

            res.cookie('session', session.secret, {
                expires: new Date(Date.now() - 1000),
            });

            return res.status(200).json(new ResponseModel(true, 'Successfully logged out', null));
        });
    }
}
