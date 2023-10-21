import 'dotenv/config';

import express, { Request, Response } from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send('<h1>Hello World!</h1>');
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
