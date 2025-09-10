import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, resp: Response) => {
  resp.send(process.env.OPENAI_API_KEY);
});

app.get('/api/hello', (req: Request, resp: Response) => {
  resp.json({ message: 'Hello Daddy !' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
