import * as express from 'express';
import userRouter from './login.routes';
import teamsRoutes from './teams.routes';

const router = express.Router();

router.use('/login', userRouter);

router.use('/teams', teamsRoutes);

export default router;
