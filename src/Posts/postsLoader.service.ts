import { Injectable } from '@nestjs/common';
import chunk from 'lodash/chunk';

import { CategoriesService } from '../Categories/categories.service';
import { PostsService } from './posts.service';


@Injectable()
export class PostsLoaderService {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly postService: PostsService,
  ) { }


  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkPosts({
    categoryId = 1,
    pageNo = 1,
    perPageItems = 100,
  } = {}): Promise<Object> {
    const postsPath = `${process.env.HOST}${process.env.JSON_PATH}${process.env.POST_PATH}`;
    const postsQuery = `?categories=${categoryId}&page=${pageNo}&per_page=${perPageItems}`;
    const postsFinalPath = `${postsPath}${postsQuery}`;
    try {
      const response = await fetch(postsFinalPath);
      const { status } = response;
      if (status === 200) {
        const posts = await response.json();
        return {
          posts,
        };
      }

      return {
        posts: [],
      };
    } catch (e) {
      return {
        postsFinalPath,
        error: e,
        posts: [],
      };
    }
  }


  async syncAllCategories(): Object {
    const dbCategories = await this.categoryService.getAll();
    const { categories: webCategories } = await this.categoryService.getNetworkCategories();
    const initialLoadingDone = !!dbCategories.length;
    if (initialLoadingDone) {
      this.loadCategoriesAndPosts({ webCategories });
    } else {

    }
    return {};
  }

  async syncAllPosts({ dbCategories, webCategories }): boolean {
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
        const post = this.postService.getPost({ id: webPost.id });
        webPost.id !== post.id && (await this.postService.create(webPost));
      }
    }

    return true;
  }

  async loadCategoriesAndPosts({ webCategories }): boolean {

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