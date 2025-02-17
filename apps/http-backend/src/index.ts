import express from 'express';
import appRoutes from './routes';
import handleError from './middleware/globalErrorHandler';
import logger from 'morgan';

const app = express();

app.use(express.json());

app.use(logger('dev'));

app.use('/api/v1', appRoutes);

app.use(handleError);

app.listen(8000, () => {
  console.log('Listening on 8000');
});

