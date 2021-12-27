const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');

const middleware = require('./utils/middleware');

const mongoose = require('mongoose');
logger.info('connection to', config.MONGODB_URI);
const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => {
  console.log('Connected to mongoDb');
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.get('/', (request, response) => {
  response.send('hello world');
});

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
