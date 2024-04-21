import 'dotenv/config';
import 'express-async-errors';

import express, { Request, Response } from 'express';
import cors from 'cors';
import errorHandler from '@src/middlewares/ErrorHandler';

import routes from './routes';
import morgan from 'morgan';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  morgan(
    '[:date[iso]] - ' +
      'Method: :method - ' +
      'URL: :url - ' +
      'Response Status: :status - ' +
      'Content-Length: :res[content-length] - ' +
      'Response Time: :response-time[2] ms - ' +
      'Total Time: :total-time[2] ms'
  )
);

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.use('/api/v1', routes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
