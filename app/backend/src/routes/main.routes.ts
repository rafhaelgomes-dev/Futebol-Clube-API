import * as express from 'express';
import userRouter from './login.routes';
import teamsRoutes from './teams.routes';
import matchesRoutes from './matches.routes';
import leaderBoardRoutes from './leaderboard.routes';

const router = express.Router();

router.use('/login', userRouter);

router.use('/teams', teamsRoutes);

router.use('/matches', matchesRoutes);

router.use('/leaderboard', leaderBoardRoutes);

export default router;
