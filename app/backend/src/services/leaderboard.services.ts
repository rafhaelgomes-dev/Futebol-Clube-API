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

let jogos = 0;
let derrotas = 0;
let golsMarcados = 0;
let golsSofridos = 0;
let point = 0;
let vitoria = 0;
let empates = 0;

export default class Leaderboard {
  static calculatePointVitoriaEmpates(time: Iteams, matches: IMatchesTime[]) {
    matches.forEach((partidas: IMatchesTime) => {
      if ((partidas.awayTeam.teamName === time.teamName)) {
        point += partidas.homeTeamGoals < partidas.awayTeamGoals ? 3 : 0;
        point += partidas.homeTeamGoals === partidas.awayTeamGoals ? 1 : 0;
      }

      if (partidas.homeTeam.teamName === time.teamName && !partidas.inProgress) {
        point += partidas.homeTeamGoals > partidas.awayTeamGoals ? 3 : 0;
        point += partidas.homeTeamGoals === partidas.awayTeamGoals ? 1 : 0;
      }
      Leaderboard.vitoriaEmpate(partidas, time);
    });

    const calculateDerrotasGolsJogos = Leaderboard.calculateDerrotasGols(time, matches);

    return { point, vitoria, empates, calculateDerrotasGolsJogos };
  }

  static vitoriaEmpate(partidas: IMatchesTime, time: Iteams) {
    if ((partidas.awayTeam.teamName === time.teamName)) {
      vitoria += partidas.homeTeamGoals < partidas.awayTeamGoals ? 1 : 0;
      empates += partidas.homeTeamGoals === partidas.awayTeamGoals ? 1 : 0;
    }

    if (partidas.homeTeam.teamName === time.teamName && !partidas.inProgress) {
      vitoria += partidas.homeTeamGoals > partidas.awayTeamGoals ? 1 : 0;
      empates += partidas.homeTeamGoals === partidas.awayTeamGoals ? 1 : 0;
    }
  }

  static calculateDerrotasGols(time: Iteams, matches: IMatchesTime[]) {
    matches.forEach((partidas: IMatchesTime) => {
      if (
        (
          partidas.awayTeam.teamName === time.teamName
        || partidas.homeTeam.teamName === time.teamName)
        && !partidas.inProgress) {
        jogos += 1;
      }
      Leaderboard.outrosCalculos(partidas, time);
    });

    return { jogos, derrotas, golsMarcados, golsSofridos };
  }

  static outrosCalculos(partidas: IMatchesTime, time: Iteams) {
    if (
      partidas.awayTeam.teamName === time.teamName
      && !partidas.inProgress
    ) {
      derrotas += partidas.homeTeamGoals > partidas.awayTeamGoals ? 1 : 0;
      golsSofridos += partidas.homeTeamGoals;
      golsMarcados += partidas.awayTeamGoals;
    }

    if (partidas.homeTeam.teamName === time.teamName && !partidas.inProgress) {
      derrotas += partidas.homeTeamGoals < partidas.awayTeamGoals ? 1 : 0;
      golsMarcados += partidas.homeTeamGoals;
      golsSofridos += partidas.awayTeamGoals;
    }
  }

  static sort(obj: classificacoes[]) {
    return obj.sort((a: classificacoes, b: classificacoes) => b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
    || a.goalsOwn - b.goalsOwn);
  }

  static createObj(res: res, time: Iteams) {
    const eff = (res.point / (res.calculateDerrotasGolsJogos.jogos * 3)) * 100;
    const obj = {
      name: time.teamName,
      totalPoints: point,
      totalGames: jogos,
      totalVictories: vitoria,
      totalDraws: empates,
      totalLosses: derrotas,
      goalsFavor: golsMarcados,
      goalsOwn: golsSofridos,
      goalsBalance: golsMarcados
      - golsSofridos,
      efficiency: eff.toFixed(2),
    };
    return obj;
  }

  static zerarVariaveis() {
    jogos = 0;
    derrotas = 0;
    golsMarcados = 0;
    golsSofridos = 0;
    point = 0;
    vitoria = 0;
    empates = 0;
  }

  static async leaderboardFunc() {
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
      obj = [
        ...obj,
        Leaderboard.createObj(res, time),
      ];
      Leaderboard.zerarVariaveis();
    });

    return Leaderboard.sort(obj);
  }
}
