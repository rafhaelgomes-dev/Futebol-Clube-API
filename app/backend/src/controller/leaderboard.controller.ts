import { Request, Response } from 'express';
import servicesLeaderBoardHome from '../services/leaderboardHome.services';
import servicesLeaderBoardAway from '../services/leaderboardAway.services';

export default class Leaderboard {
  public leaderBoardHome = async (req: Request, res: Response) => {
    try {
      const result = await servicesLeaderBoardHome.leaderboardHomeFunc();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  public leaderBoardAway = async (req: Request, res: Response) => {
    try {
      const result = await servicesLeaderBoardAway.leaderboardAwayFunc();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}
