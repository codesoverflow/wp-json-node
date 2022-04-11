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
  getAll(@Query() query: PostsQuery): Promise<Object> {
    const categories = query?.categories;
    const page = query?.page;
    const perPage = query?.per_page;
    return this.postService.getAll({ categories, pageNo, perPage });
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