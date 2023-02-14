import { Router } from 'express';
import TeamsController from '../controller/teams.controller';

const router = Router();

const controller = new TeamsController();

router.get('/', controller.getAllTeams);

router.get('/:id', controller.getByIdTeams);

export default router;
