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
      const dbCategories = await this.categoryService.getAll();
      const { categories: webCategories } =
        await this.categoryService.getNetworkCategories();
      const initialLoadingDone = !!dbCategories.length;
      if (initialLoadingDone) {
        await this.syncAllPosts({ dbCategories, webCategories });
      } else {
        await this.loadCategoriesAndPosts({ webCategories });

      }
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

  async syncAllPosts({ dbCategories, webCategories }): Promise<boolean> {
    const updatedCategories = dbCategories.filter((cat, index) => {
      const webCat = webCategories[index];
      return webCat.count > cat.count;
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
        webPost?.id !== post?.id && (await this.postService.create(webPost));
      }
    }

    return true;
  }

  async loadCategoriesAndPosts({ webCategories }): Promise<boolean> {

    const webCatChunks = chunk(webCategories, 3);

    for (const webCatChunk of webCatChunks) {
      for (const webCat of webCatChunk) {
        const category = await this.categoryService.create(webCat);
        if (category) {
          const postCount = category.count;
          const categoryId = category.id;
          const pageList = getPages({ count: postCount, perPageItems });

          for (const pageNo of pageList) {
            const { posts: webPosts } = await this.postService.getNetworkPosts({
              categoryId,
              pageNo,
              perPageItems,
            });

            for (const webPost of webPosts) {
              await this.postService.create(webPost);
            }
          }
        }
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