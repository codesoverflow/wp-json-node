//https://towardsdatascience.com/build-a-rest-api-with-node-express-and-mongodb-937ff95f23a5

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({ name: String, email: String });

async function doProcessing() {
  const connection = await mongoose.connect("mongodb://localhost:27017/test", {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  });
  const UserModel = connection.model("User", userSchema);
  const user = await UserModel.create({
    name: `jm${Math.random()}`,
    email: `jm${Math.random()}@gmail.com`,
  });
  const users = await UserModel.find({});

  console.log("users", users);
}

async function getNetworkData() {
  const dbCategories = await getModelCategories();
  if (!dbCategories || (!dbCategories && !dbCategories.length)) {
    return;
  }

  const { categories } = await getNetworkCategories();
  if (!categories || (categories && categories.length === 0)) {
    return;
  }

  const networkCategories = {};
  categories.forEach((category) => {
    networkCategories[category.id] = category.count;
  });

  const diffCategories = [];
  dbCategories.forEach((dbCategory) => {
    const networkCount = networkCategories[dbCategory.id];

    // If app is running with single category
    if (isSingleCat()) {
      const singleCat = getSingleCat();
      if (dbCategory.id !== singleCat) {
        return;
      }
    }

    if (networkCount > dbCategory.count) {
      diffCategories.push({
        ...dbCategory,
        count: networkCount,
        diffCount: networkCount - dbCategory.count,
      });
    }
  });

  if (!diffCategories || !diffCategories.length) {
    return;
  }

  // Update category counts and set as new
  await updateCategories(diffCategories);
  let totalSyncedCategories = 0;
  for (const diffCategory of diffCategories) {
    const categoryId = diffCategory.id;
    const { diffCount } = diffCategory;
    const { webPosts } = await getNetworkPosts({
      pageNo: 1,
      categoryId,
      perPageItems: diffCount,
    });

    await insertPosts(webPosts, categoryId, 1);
    totalSyncedCategories++;
  }
}

doProcessing();
