import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import ModelUser from '../database/models/UserModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando rota de login', () => {

  const MockUser = {
    username: 'rafhaelgomes@gmail.com',
    password: 'asdasdasdasdasddasdasdas'
  }

  before(async () => {
    sinon
      .stub(ModelUser, "findOne")
      .resolves(MockUser as ModelUser);
  });

  after(()=>{
    (ModelUser.findOne as sinon.SinonStub).restore();
  })

  it('Testando se é possivel realizar o login com sucesso e retornar um token', async () => {
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ username: 'rafhaelgomes@gmail.com', password: '123456'});
    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.be.eq({ token: 'asdasdasdasdasddasdasdas' });
  });
});
