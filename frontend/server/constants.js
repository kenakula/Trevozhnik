import { loadEnv } from 'vite';

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd()) };

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const PORT = process.env.VITE_PORT || 5173;
export const BASE_URL = process.env.VITE_BASE || '/';
export const PROJECT_ENDPOINT = process.env.VITE_ENDPOINT || '';
export const PROJECT_ID = process.env.VITE_PROJECT_ID || '';
