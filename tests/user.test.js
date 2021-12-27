const bcrypt = require('bcrypt');
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');

describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('sekret', saltRounds);

    const newUser = new User({
      username: 'Root',
      name: 'admin',
      passwordHash: passwordHash,
    });
    await newUser.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')

      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'Root',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');
    const userAtEnd = await helper.usersInDb();
    expect(userAtEnd).toHaveLength(usersAtStart.length);
  });
});
