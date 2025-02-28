import dotenv from 'dotenv';
import path from 'node:path';
import * as url from 'node:url';

// @ts-ignore
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const JWT_SECRET = process.env.JWT_SECRET || 'dsjbcdjsh892y8743jhbfdv';
export const SENDER_EMAIL = process.env.SENDER_EMAIL;
export const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

