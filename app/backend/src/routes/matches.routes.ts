import * as express from 'express';
import ControllerMatches from '../controller/matches.controller';
import ValidateToken from '../middleware/validateToken';

const router = express.Router();

const controller: ControllerMatches = new ControllerMatches();
const middlewareValidate = new ValidateToken();

router.get('/', controller.getAllMatches);

router.post('/', middlewareValidate.validateToken, controller.saveMatches);

router.patch('/:id/finish', controller.editMatches);

export default router;
