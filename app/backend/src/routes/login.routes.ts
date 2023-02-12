import * as express from 'express';
import loginController from '../controller/login.controller';

const userRouter = express.Router();

userRouter.post('/', loginController.realizarLogin);

userRouter.get('/validate', loginController.validateUsers);

export default userRouter;
