import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './posts.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) { }

  @Get()
  getAll(): Promise<Object> {
    return this.postService.getNetworkPosts();
  }
}
