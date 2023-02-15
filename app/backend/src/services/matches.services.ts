import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import IMatches from '../interfaces/IMatches';
import { ResultTypes } from '../types/ResultTypes';

export default class Matches {
  private _model;

  constructor() {
    this._model = MatchesModel;
  }

  public async getAllMatches(inProgress: string) {
    let boolean: boolean;

    if (inProgress === 'true') { boolean = true; } else { boolean = false; }

    if (inProgress) {
      const result = await this._model.findAll({
        where: { inProgress: boolean },
        include: [
          { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } }],
      });

      return result;
    }

    const result = await this._model.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } }],
    });
    return result;
  }

  public async saveMatches(data: IMatches): Promise<ResultTypes> {
    const homeTeam = await TeamModel.findOne({ where: { id: data.homeTeamId } });
    const awayTeam = await TeamModel.findOne({ where: { id: data.awayTeamId } });
    if (!homeTeam || !awayTeam) {
      return { type: 'error', statusCode: 404, message: 'There is no team with such id!' };
    }

    if (data.homeTeamId === data.awayTeamId) {
      return {
        type: 'error',
        statusCode: 422,
        message: 'It is not possible to create a match with two equal teams',
      };
    }

    const result = await this._model.create({ ...data, inProgress: true });
    return { type: null, statusCode: 201, message: result };
  }
}
