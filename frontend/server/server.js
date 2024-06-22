import { App } from './app.js';
import { AuthRoute } from './routes/auth.route.js';

const app = new App([new AuthRoute()]);

app.listen();

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💥 SHUTTING DOWN...');
    console.log(err.name, err.message);
    process.exitCode = 1;
});
