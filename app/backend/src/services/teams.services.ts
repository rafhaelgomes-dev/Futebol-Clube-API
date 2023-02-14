import teamsModel from '../database/models/TeamModel';
import { Iteams } from '../interfaces/ITeams';

export default class Teams {
  private _teamsModel;

  constructor() {
    this._teamsModel = teamsModel;
  }

  public async getAllTeams(): Promise<Iteams[]> {
    const result = await this._teamsModel.findAll();
    return result;
  }

  public async getByIdTeams(id: number): Promise<Iteams | null> {
    const result = await this._teamsModel.findByPk(id);
    return result;
  }
}
