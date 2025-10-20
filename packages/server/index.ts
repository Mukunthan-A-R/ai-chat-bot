import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAi from 'openai';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is Required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      const formattedError = z.treeifyError(parseResult.error);
      return res.status(400).json(formattedError);
   }

   try {
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
   } catch (err) {
      res.status(500).json({ error: 'Failed to generate a response' });
   }
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello World',
   });
});

app.listen(port, () => {
   console.log(`The server is runing in port http://localhost:${port}`);
});
