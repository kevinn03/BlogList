const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

//4.8 test1
test('all blogss are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('to be defined', async () => {
  const data = await helper.blogsInDb();

  expect(data[0].id).toBeDefined();
});

test('Add a blog with token', async () => {
  const data = await helper.blogsInDb();

  const login = {
    username: 'Root',
    password: 'sekret',
  };

  const response = await api
    .post('/api/login')
    .send(login)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  const newBlog = {
    title: 'NBA covid protocols',
    author: 'Woj',
    url: 'www.nba.com',
    likes: 30000,
  };

  const token = response.body.token;

  const response2 = await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + token)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  console.log(response2);
  const newData = await helper.blogsInDb();
  expect(newData).toHaveLength(data.length + 1);

  expect(newData[newData.length - 1]).toEqual(response2.body);
});

test('Add a blog without token', async () => {
  const data = await helper.blogsInDb();

  const newBlog = {
    title: 'NBA covid protocols',
    author: 'Woj',
    url: 'www.nba.com',
    likes: 30000,
  };

  const response2 = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
  console.log(response2.body);
  const newData = await helper.blogsInDb();
  expect(newData).toHaveLength(data.length);
});

test('missing likes', async () => {
  const newBlog = new Blog({
    title: 'NFLcovid protocols',
    author: 'Woj',
    url: 'www.nfl.com',
  });
  await newBlog.save();
  const data = await helper.blogsInDb();

  expect(data[data.length - 1].likes).toEqual(0);
});

test('missing title and url', async () => {
  const newBlog = new Blog({
    title: 'NFLcovid protocols',
    author: 'Woj',
    url: 'www.nfl.com',
  });

  await api.post('/api/blogs').send(newBlog.toJSON()).expect(200);
});

test('delete a blog', async () => {
  const blogs = await helper.blogsInDb();
  const chosen = blogs[2].id;
  await api.delete(`/api/blogs/${chosen}`).expect(204);
});

test('update a blog', async () => {
  const blogs = await helper.blogsInDb();
  const chosen = blogs[2].id;
  const newBlog = new Blog({
    ...blogs[2],
    title: 'NFLcovid protocols',
  });

  await api.put(`/api/blogs/${chosen}`).send(newBlog.toJSON()).expect(200);
});

afterAll(() => {
  mongoose.connection.close();
});
