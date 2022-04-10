const {getPostsPath} = require('../configs')
function getNetworkPosts() {
    try {
        const postsPath = getPostsPath({categoryId ,pageNo ,
            perPageItems ,})
        const response = await fetch(categoriesPath);
        const {status} = response;
        if (status === 200) {
            const webPosts = await response.json();
            return {
            webPosts,
            };
        }

        return {
            webPosts: [],
        };
    } catch (e) {
        return {
            webPosts: [],
        };
    }
}

exports.getNetworkPosts = getNetworkPosts;
