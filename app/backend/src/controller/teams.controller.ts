import { Response, Request } from 'express';
import TeamsService from '../services/teams.services';

export default class Teams {
  private _serviceTeams;
  constructor() {
    this._serviceTeams = new TeamsService();
  }

  public getAllTeams = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this._serviceTeams.getAllTeams();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(200).json(error);
    }
  };

  public getByIdTeams = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const result = await this._serviceTeams.getByIdTeams(Number(id));
      return res.status(200).json(result);
    } catch (error) {
      return res.status(200).json(error);
    }
  };
}
