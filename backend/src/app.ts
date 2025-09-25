import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(cors({
   origin: '*',
   credentials: true
}))
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cookieParser());

//routes import
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

export default app;