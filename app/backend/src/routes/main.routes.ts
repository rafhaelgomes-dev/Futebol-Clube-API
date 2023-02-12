import * as express from 'express';
import userRouter from './login.routes';

const router = express.Router();

router.use('/login', userRouter);

export default router;
