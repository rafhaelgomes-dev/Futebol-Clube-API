import * as express from 'express';
import Controller from '../controller/leaderboard.controller';

const router = express.Router();

const leaderboardController = new Controller();

router.get('/home', leaderboardController.leaderBoardHome);

router.get('/away', leaderboardController.leaderBoardAway);

export default router;
