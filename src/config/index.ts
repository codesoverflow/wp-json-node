const HOST = process.env.HOST;
const JSON_PATH = process.env.JSON_PATH
const CATEGORY_PATH = process.env.CATEGORY_PATH

export const categoriesPath = () => `${HOST}${JSON_PATH}${CATEGORY_PATH}`