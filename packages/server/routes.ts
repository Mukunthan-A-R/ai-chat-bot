import express from 'express';
import { chatController } from './controllers/chat.controller';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello World',
   });
});

export default router;
