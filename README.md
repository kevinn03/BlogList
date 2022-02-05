<h1 align="center">Blog List</h1>

## About

Fully functional Blog app where users can create accouts, login, post blogs, view blogs and upvote.



Api providing endpoints that allow for:

- Getting all blogs
- Create a blog
- Deleting a blog
- Updating a blog
- Logging in
- Createa user
- Get all users

## Install

git clone \

npm install

npm run dev

localhost:3003

## Endpoint Documentation

### GET /api/blogs

Returns a list of all the latest blogs.


### GET /api/blogs/{id}

Returns a blog based on {id}.

### POST /api/blogs

Create a blog.


### PUT /api/blogs/{id}

Update blog with id equal {id}

### DELETE /api/blogs/{id}

Delete blog with id equal {id}

### POST /api/login

Login user

### GET /api/users

Return all users

### POST /api/users

Create a user



## To Do:

- Add commennts for blogs
- Style
- Add further testing for frontend and backend
- Add Date for blogs
- Add option to sort blogs by date

## Dependencies
[bcrypt]
[cors]
[dotenv]
[express]
[express-async-errors]
[json web token]
[mongoose]
[mongoose unique validator]
[prop-types]
[eslint]
[jest]
[cypress]
[supertest]

## Author

👤 **Kevin Nguyen**
