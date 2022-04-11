import { Injectable } from '@nestjs/common';
import { chunk } from 'lodash';

import { CategoriesService } from '../Categories/categories.service';
import { PostsService } from './posts.service';


@Injectable()
export class PostsLoaderService {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly postService: PostsService,
  ) { }


  async syncAllCategories(): Promise<SyncType> {
    try {
      await this.syncAllPosts();
    } catch (error) {
      return {
        error: {
          name: error.name,
          message: error.message,
        },
        isSucess: false,
      };
    }
    return {
      isSucess: true,
    };
  }

  async loadCategoriesAndSyncPosts(): Promise<SyncType> {
    try {
      await this.loadCategoriesAndPosts();
    } catch (error) {
      return {
        error: {
          name: error.name,
          message: error.message,
        },
        isSucess: false,
      };
    }
    return {
      isSucess: true,
    };
  }


  private async syncAllPosts(): Promise<boolean> {
    const dbCategories = await this.categoryService.getAll();
    const { categories: webCategories } =
      await this.categoryService.getNetworkCategories();

    const updatedCategories = webCategories.filter((webCat, index) => {
      const dbCat = dbCategories[index];
      return webCat.count > dbCat.count;
    });

    for (const updatedCategory of updatedCategories) {
      const udpatedCategoryCount = updatedCategory.count;
      const pageList = getPages({ count: udpatedCategoryCount, perPageItems });
      const categoryId = updatedCategory.id;
      const reversePageList = pageList.reverse();
      const [lastPageNo = 1] = reversePageList;
      const { posts: webPosts } = await this.postService.getNetworkPosts({
        categoryId,
        pageNo: lastPageNo,
        perPageItems,
      });

      for (const webPost of webPosts) {
        const post = await this.postService.getPost({ id: webPost.id });
        webPost?.id !== post?.id && (await this.postService.create({ ...webPost, categoryId }));
      }

      this.categoryService.update({
        id: updatedCategory.id,
        count: updatedCategory.count,
      });
    }

    return true;
  }

  private async loadCategoriesAndPosts(): Promise<boolean> {
    const { categories: webCategories } =
      await this.categoryService.getNetworkCategories();
    const webCatChunks = chunk(webCategories, 3);

    for (const webCatChunk of webCatChunks) {
      for (const webCat of webCatChunk) {
        const dbCat = await this.categoryService.get({ id: webCat?.id });

        if (webCat?.id) {
          const postCount = webCat?.count;
          const categoryId = webCat?.id;
          const pageList = getPages({ count: postCount, perPageItems });

          for (const pageNo of pageList) {
            const { posts: webPosts } = await this.postService.getNetworkPosts({
              categoryId,
              pageNo,
              perPageItems,
            });

            for (const webPost of webPosts) {
              await this.postService.create({ ...webPost, categoryId });
            }
          }
        }

        dbCat?.id === webCat?.id
          ? await this.categoryService.update(webCat)
          : await this.categoryService.create(webCat);
      }
    }

    return true;
  }
}

function getPages({ count, perPageItems }) {
  const pageList = Array.from(Array(Math.ceil(count / perPageItems)).keys());
  return pageList.map((pageIndex) => pageIndex + 1);
}
const perPageItems = 100;
type SyncType = {
  error?: Object;
  isSucess: boolean;
};