import MatchesModel from '../database/models/MatchesModel';
import TeamModel from '../database/models/TeamModel';
import { IMatchesTime } from '../interfaces/IMatches';
import { Iteams } from '../interfaces/ITeams';
import Teams from './teams.services';

type classificacoes = {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: string,
};

type res = {
  point: number;
  vitoria: number;
  empates: number;
  calculateDerrotasGolsJogos: {
    jogos: number;
    derrotas: number;
    golsMarcados: number;
    golsSofridos: number;
  };
};

export default class Leaderboard {
  static calculatePointVitoriaEmpates(time: Iteams, matches: IMatchesTime[]) {
    let point = 0;
    let vitoria = 0;
    let empates = 0;

    matches.forEach((partidas: IMatchesTime) => {
      if (
        partidas.homeTeam.teamName === time.teamName
        && partidas.homeTeamGoals >= partidas.awayTeamGoals
      ) {
        point += partidas.homeTeamGoals > partidas.awayTeamGoals ? 3 : 1;
        vitoria += partidas.homeTeamGoals > partidas.awayTeamGoals ? 1 : 0;
        empates += partidas.homeTeamGoals === partidas.awayTeamGoals ? 1 : 0;
      }
    });

    const calculateDerrotasGolsJogos = Leaderboard.calculateDerrotasGols(time, matches);

    return { point, vitoria, empates, calculateDerrotasGolsJogos };
  }

  static calculateDerrotasGols(time: Iteams, matches: IMatchesTime[]) {
    let derrotas = 0;
    let golsMarcados = 0;
    let golsSofridos = 0;
    let jogos = 0;

    matches.forEach((partidas: IMatchesTime) => {
      if (partidas.homeTeam.teamName === time.teamName) {
        jogos += 1;
        golsMarcados += partidas.homeTeamGoals;
        golsSofridos += partidas.awayTeamGoals;
      }

      if (
        partidas.homeTeam.teamName === time.teamName
        && partidas.homeTeamGoals < partidas.awayTeamGoals
      ) {
        derrotas += 1;
      }
    });

    return { jogos, derrotas, golsMarcados, golsSofridos };
  }

  static sort(obj: classificacoes[]) {
    return obj.sort((a: classificacoes, b: classificacoes) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || a.goalsOwn - b.goalsOwn);
  }

  static createObj(res: res, eff: number, time: Iteams) {
    const obj = {
      name: time.teamName,
      totalPoints: res.point,
      totalGames: res.calculateDerrotasGolsJogos.jogos,
      totalVictories: res.vitoria,
      totalDraws: res.empates,
      totalLosses: res.calculateDerrotasGolsJogos.derrotas,
      goalsFavor: res.calculateDerrotasGolsJogos.golsMarcados,
      goalsOwn: res.calculateDerrotasGolsJogos.golsSofridos,
      goalsBalance: res.calculateDerrotasGolsJogos.golsMarcados
      - res.calculateDerrotasGolsJogos.golsSofridos,
      efficiency: eff.toFixed(2),
    };
    return obj;
  }

  static async leaderboardHome() {
    const serviceTeam = new Teams();

    const result = await serviceTeam.getAllTeams();

    const matches = await MatchesModel.findAll({
      where: { inProgress: false },
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } }],
    }) as unknown as IMatchesTime[];

    let obj: classificacoes[] = [];
    result.forEach((time) => {
      const res = Leaderboard.calculatePointVitoriaEmpates(time, matches);
      const eff = (res.point / (res.calculateDerrotasGolsJogos.jogos * 3)) * 100;
      obj = [
        ...obj,
        Leaderboard.createObj(res, eff, time),
      ];
    });

    return Leaderboard.sort(obj);
  }
}
