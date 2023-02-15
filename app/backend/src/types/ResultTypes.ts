import Matches from '../database/models/MatchesModel';

export type ResultTypes = {
  type: string | null,
  statusCode: number,
  message: string | Matches | number,
};
