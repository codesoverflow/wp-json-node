import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from 'src/Posts/posts.service';
import { CategoriesService } from '../Categories/categories.service';

@Controller('bdTest')
export class BdTestController {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly postService: PostsService,
  ) { }

  @Get('categories')
  async getCategories(): Promise<Object> {
    const { categories, error } =
      await this.categoryService.getNetworkCategories();
    if (error) {
      error;
    }
    return categories;
  }

  @Get('posts')
  async getAll(@Query() query: PostsQuery): Promise<Object> {
    const categories = query?.categories;
    const page = query?.page;
    const perPage = query?.per_page;
    const { posts, error } = await this.postService.getNetworkPosts({
      categoryId: categories,
      pageNo: page,
      perPageItems: perPage,
    });

    if (error) {
      return error;
    }

    return posts;
  }

}



type PostsQuery = {
  categories: number;
  page: number;
  per_page: number;
};