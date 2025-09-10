import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required !')
    .max(1000, 'Prompt can be of max 1000 characters'),
  conversationId: z.uuid(),
});

export const controller = {
  async chat(req: Request, resp: Response) {
    const parseReq = chatSchema.safeParse(req.body);
    if (!parseReq.success) {
      resp.status(400).json(z.treeifyError(parseReq.error)).status(400);
      return;
    }

    const { prompt, conversationId } = req.body;
    const chatResponse = chatService.sendMessage(prompt, conversationId);
    resp.json({ message: (await chatResponse).message });
  },
};
