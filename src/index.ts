import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response } from 'express';
import cors from 'cors';
import errorHandler from '@src/middlewares/ErrorHandler';

import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.use('/api/v1', routes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
