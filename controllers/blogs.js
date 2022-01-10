const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    return response.status(400).end();
  }
  const body = request.body;
  const token = request.token;
  const user = request.user;

  if (!token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const dbUser = await User.findById(user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: dbUser._id,
  });

  const result = await blog.save();

  dbUser.blogs = dbUser.blogs.concat(result._id);
  await dbUser.save();
  response.json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const body = request.params;

  const token = request.token;

  const user = request.user;
  if (!token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const userid = user.id;
  const blog = await Blog.findById(body.id);

  if (blog.user.toString() === userid.toString()) {
    const result = await Blog.findByIdAndDelete(blog.id);
    return response.json(result);
  }
  response.status(400).json({ error: 'invalid owner' });
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const token = request.token;
  const user = request.user;

  if (!token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  body.likes++;
  const blog = {
    ...body,
  };

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedNote.toJSON());
});

module.exports = blogsRouter;
