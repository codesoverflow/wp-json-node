import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsLoaderService } from './postsLoader.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly postsLoaderService: PostsLoaderService,
  ) { }

  @Get()
  async getAll(@Query() query: PostsQuery): Promise<Object> {
    const categories = query?.categories;
    const page = query?.page;
    const perPage = query?.per_page;
    const { posts, error } = await this.postService.getAll({
      categories,
      pageNo: page,
      perPage,
    });

    if (error) {
      return error;
    }

    return posts;
  }

  @Get('syncCategories')
  async syncCategories(): Promise<Object> {
    return await this.postsLoaderService.syncAllCategories();
  }

  @Get('loadCategoriesAndSyncPosts')
  async loadCategoriesAndSyncPosts(): Promise<Object> {
    return await this.postsLoaderService.loadCategoriesAndSyncPosts();
  }

}

type PostsQuery = {
  categories: number;
  page: number;
  per_page: number;
};