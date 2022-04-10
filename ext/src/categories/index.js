const {categoriesPath} = require('../configs')
function getNetworkCategories() {
    try {
        const response = await fetch(categoriesPath);
        const {status} = response;
        if (status === 200) {
            const categories = await response.json();
            return {
            categories,
            };
        }

        return {
            categories: [],
        };
    } catch (e) {
        return {
            categories: [],
        };
    }
}

exports.getNetworkCategories = getNetworkCategories;
