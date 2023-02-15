import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';

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
}
