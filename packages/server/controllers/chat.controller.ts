import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is Required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
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
   },
};
