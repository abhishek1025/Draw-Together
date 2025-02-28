import express from 'express';
import appRoutes from './routes';
import handleError from './middleware/globalErrorHandler';
import logger from 'morgan';
import cors from 'cors';
import {CLIENT_URL} from "@repo/backend-common/config";

const app = express();

app.use(cors({
  origin: CLIENT_URL, // frontend URL
  credentials: true, // Allow cookies
}));

app.use(express.json());

app.use(logger('dev'));

app.use('/api/v1', appRoutes);

app.use(handleError);

app.listen(8000, () => {
  console.log('Listening on 8000');
});
