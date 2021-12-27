const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  const sum = (total, nextValue) => total + nextValue.likes;

  return blogs.length === 0 ? 0 : blogs.reduce(sum, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const max = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });

  return max;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
