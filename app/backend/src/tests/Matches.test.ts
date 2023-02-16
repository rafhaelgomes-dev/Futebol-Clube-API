import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import MatchesModel from '../database/models/MatchesModel';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando rota de Partidas', () => {

  const partidasEmAndamentoMock = [
    {
      "id": 41,
      "homeTeamId": 16,
      "homeTeamGoals": 2,
      "awayTeamId": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "São Paulo"
      },
      "awayTeam": {
        "teamName": "Internacional"
      }
    },
    {
      "id": 42,
      "homeTeamId": 6,
      "homeTeamGoals": 1,
      "awayTeamId": 1,
      "awayTeamGoals": 0,
      "inProgress": true,
      "homeTeam": {
        "teamName": "Ferroviária"
      },
      "awayTeam": {
        "teamName": "Avaí/Kindermann"
      }
    }
  ];

  const partidasFinalizadas = [
    {
      "id": 1,
      "homeTeamId": 16,
      "homeTeamGoals": 1,
      "awayTeamId": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeTeam": {
        "teamName": "São Paulo"
      },
      "awayTeam": {
        "teamName": "Grêmio"
      }
    },
    {
      "id": 2,
      "homeTeamId": 9,
      "homeTeamGoals": 1,
      "awayTeamId": 14,
      "awayTeamGoals": 1,
      "inProgress": false,
      "homeTeam": {
        "teamName": "Internacional"
      },
      "awayTeam": {
        "teamName": "Santos"
      }
    }
  ]

  const mockInserirPartida = {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 8,
    "awayTeamGoals": 2,
    "inProgress": true,
  }

  const mockInserirPartidaRes = {
    "homeTeamId": 16,
    "awayTeamId": 8,
    "homeTeamGoals": 2,
    "awayTeamGoals": 2,
  }
  
  let token: string;

  it('Retornar todas as partidas em andamento', async () => {
      sinon
        .stub(MatchesModel, "findAll")
        .resolves(partidasEmAndamentoMock as unknown as MatchesModel[]);

    const chaiHttpResponse: Response = await chai.request(app).get('/matches');
    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.deep.equal(partidasEmAndamentoMock);
    sinon.restore();
  });

  it('Retorna todas as partidas finalizadas', async () => {
    sinon
    .stub(MatchesModel, "findAll")
    .resolves(partidasFinalizadas as unknown as MatchesModel[]);

      const chaiHttpResponse: Response = await chai.request(app).get('/matches?inProgress=false');
      expect(chaiHttpResponse.status).to.be.eq(200);
      expect(chaiHttpResponse.body).to.deep.equal(partidasFinalizadas);

    sinon.restore();
  });

  it('Gerando token', async () => {
    sinon
    .stub(UserModel, "findOne")
    .resolves({
      email: 'user@user.com',
      password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
    } as UserModel);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ email: 'user@user.com', password: 'secret_user'});
    token = chaiHttpResponse.body.token;
    sinon.restore();
  });

  it('Salvar uma partida com o status de inProgress como true', async () => {
    sinon
    .stub(MatchesModel, "create")
    .resolves(mockInserirPartida as unknown as MatchesModel);
      const chaiHttpResponse: Response = await chai.request(app).post('/matches').set({"Authorization": token}).send(mockInserirPartidaRes);
      expect(chaiHttpResponse.status).to.be.eq(201);
      expect(chaiHttpResponse.body).to.deep.equal(mockInserirPartida);

    sinon.restore();
  });

  it('Não Salvar uma partida com o status de inProgress como true se o time não existir', async () => {
    sinon
    .stub(MatchesModel, "create")
    .resolves(mockInserirPartida as unknown as MatchesModel);
      const chaiHttpResponse: Response = await chai.request(app).post('/matches').set({"Authorization": token}).send({
        "homeTeamId": 100,
        "awayTeamId": 2000,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2,
      });
      expect(chaiHttpResponse.status).to.be.eq(404);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'There is no team with such id!' });

    sinon.restore();
  });

  it('Não Salvar uma partida com o status de inProgress como true se o times forem os mesmo', async () => {
    sinon
    .stub(MatchesModel, "create")
    .resolves(mockInserirPartida as unknown as MatchesModel);
      const chaiHttpResponse: Response = await chai.request(app).post('/matches').set({"Authorization": token}).send({
        "homeTeamId": 16,
        "awayTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamGoals": 2,
      });
      expect(chaiHttpResponse.status).to.be.eq(422);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });

    sinon.restore();
  });

  it('Alterar o status inProgress de uma partida para false', async () => {
    sinon
    .stub(MatchesModel, "update")
    .resolves();
    const chaiHttpResponse = await chai
    .request(app)
    .patch('/matches/5')
    .send({
      "homeTeamGoals": 3,
      "awayTeamGoals": 1
    });
      expect(chaiHttpResponse.status).to.be.eq(400);

    sinon.restore();
  });
});
