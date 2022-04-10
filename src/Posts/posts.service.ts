import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, postsDocumentName } from './posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(postsDocumentName) private postModel: Model<PostDocument>,
  ) { }

  async create(postData: Post): Promise<Post> {
    const post = new this.postModel(postData);
    await post.save();
    return post;
  }

  async getAll(): Promise<Post[]> {
    const posts = await this.postModel.find({ id: 123 }).exec();
    return posts;
  }

  async getPost({ id }) {
    return await this.postModel.find({ id }).exec();
  }

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

}
