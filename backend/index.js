import express from 'express';
import dotenv from 'dotenv';
import db from './src/db/db.connect.js';
import tableCreate from './src/db/dbCreate.js';
import cors from "cors";

dotenv.config();

import authRouter from './src/routers/authRouter.js';
import moviesRouter from './src/routers/moviesRouter.js';
import commentsRouter from './src/routers/commentsRouter.js';
import socialRouter from './src/routers/socialRouter.js';
import userRouter from './src/routers/userRouter.js';

const app = express();

app.use(express.json());
app.use(cors())
app.use('/auth', authRouter);
app.use('/movies', moviesRouter);
app.use('/comments', commentsRouter);
app.use('/social', socialRouter);
app.use('/user', userRouter);

const PORT = process.env.PORT || 3333;

try {
    await db.connect();
    console.log('✅ Database connected');
    await tableCreate();
    app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
} catch (e){
    console.error(e);
}

