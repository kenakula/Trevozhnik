import { Account, Client, ID } from 'node-appwrite';

export const userHandler = async (req, res) => {
    const session = req.cookies?.session;

    if (!session) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const client = new Client()
        .setEndpoint(process.env.VITE_ENDPOINT)
        .setProject(process.env.VITE_PROJECT_ID);

    client.setSession(session);

    const account = new Account(client);

    try {
        const user = await account.get();

        res.status(200).json({ success: true, user });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

export const signupHandler = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: 'No body in request', success: false });
    }

    const { email, password } = req.body;

    const client = new Client()
        .setEndpoint(process.env.VITE_ENDPOINT)
        .setProject(process.env.VITE_PROJECT_ID)
        .setKey(process.env.VITE_API_KEY);

    const account = new Account(client);

    try {
        const user = await account.create(ID.unique(), email, password);
        res.status(201).json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
};

export const logoutHandler = async (req, res) => {
    const session = req.cookies?.['session'];

    if (!session) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    res.cookie('session', session.secret, {
        expires: new Date(Date.now() - 1000),
    });

    return res.status(200).json({ success: true });
};

export const loginHandler = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: 'No body in request', success: false });
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

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('=>(handlers.js:55) err', err);
        res.status(400).json({ success: false, error: err.message });
    }
};
