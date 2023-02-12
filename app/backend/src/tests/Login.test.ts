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
    email: 'user@user.com',
    password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
  }

  before(async () => {
    sinon
      .stub(ModelUser, "findOne")
      .resolves(MockUser as ModelUser);
  });

  after(()=>{
    (ModelUser.findOne as sinon.SinonStub).restore();
  })

  it('É possivel realizar o login com sucesso e retornar um token', async () => {
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ email: 'user@user.com', password: 'secret_user'});
    expect(chaiHttpResponse.status).to.be.eq(200);
    expect(chaiHttpResponse.body).to.have.all.keys('token');
  });

  it('Não é possivel fazer o login se não enviar um e-mail', async () => {
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ password: 'secret_user'});
    expect(chaiHttpResponse.status).to.be.eq(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });
  });
});
