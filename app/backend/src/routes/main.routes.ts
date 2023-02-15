import * as express from 'express';
import userRouter from './login.routes';
import teamsRoutes from './teams.routes';
import matchesRoutes from './matches.routes';

const router = express.Router();

router.use('/login', userRouter);

router.use('/teams', teamsRoutes);

router.use('/matches', matchesRoutes);

export default router;
