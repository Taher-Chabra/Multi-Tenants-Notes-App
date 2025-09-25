import app from '../src/app.js';
import connectDB from '../src/db/index.js';

connectDB().catch((err: any) => console.error("DB connection error:", err));

export default app;