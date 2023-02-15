import * as express from 'express';
import ControllerMatches from '../controller/matches.controller';

const router = express.Router();

const controller: ControllerMatches = new ControllerMatches();

router.get('/', controller.getAllMatches);

export default router;
