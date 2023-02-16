import { Request, Response } from 'express';
import services from '../services/leaderboard.services';

export default class Leaderboard {
  public leaderBoardHome = async (req: Request, res: Response) => {
    try {
      const result = await services.leaderboardHome();
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };
}
