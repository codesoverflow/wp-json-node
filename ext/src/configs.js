const hostPath = "https://www.bhajandiary.com";
const jsonPath = "/wp-json/wp/v2/";
const categoriesPath = `${hostPath}${jsonPath}categories?page=1&per_page=100`;
const getPostsPath = function ({
  categoryId = 1,
  pageNo = 1,
  perPageItems = 100,
}) {
  const postsPath = `posts?categories=${categoryId}&page=${pageNo}&per_page=${perPageItems}`;
  return `${hostPath}${jsonPath}${postsPath}`;
};

exports = {
  hostPath,
  jsonPath,
  categoriesPath,
  getPostsPath,
};
