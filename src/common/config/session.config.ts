import dotenv from 'dotenv';
import { SessionOptions } from 'express-session';

dotenv.config();

export const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // 1 hour
    httpOnly: true,  // Prevent client-side access to cookies
    secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
  },
};
