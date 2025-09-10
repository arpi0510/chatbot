import { Router } from 'express';
import { controller } from './controllers/chat.controller';

const router = Router();
router.post('/api/chat', controller.chat);

export default router;
