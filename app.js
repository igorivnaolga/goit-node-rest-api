import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import sequelize from './db/sequelize.js';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

const { SERVER_PORT } = process.env;
const port = Number(SERVER_PORT);

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
  app.listen(port, () => {
    console.log(`Server is running. Use our API on port: ${port}`);
  });
} catch (error) {
  console.log(error.message);
  process.exit(1);
}
