import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsLoaderService } from './postsLoader.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly postsLoaderService: PostsLoaderService,
  ) { }

  @Get()
  getAll(): Promise<Object> {
    return this.postService.getNetworkPosts();
  }

  @Get('syncCategories')
  async syncCategories(): Promise<Object> {
    return await this.postsLoaderService.syncAllCategories();
  }

}
