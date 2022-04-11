import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, postsDocumentName } from './posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(postsDocumentName) private postModel: Model<PostDocument>,
  ) { }

  async create(postData: WebPostType): Promise<Post> {
    const {
      id,
      date,
      slug,
      title: { rendered: title },
      content: { rendered: content },
      featured_image_url_td_100x70,
    } = postData;
    const finalPost = {
      id,
      date,
      slug,
      title,
      content,
      featured_image_url_td_100x70,
    };
    const post = new this.postModel(finalPost);
    await post.save();
    return post;
  }

  async getAll({ categories, pageNo, perPage }): Promise<Post[]> {
    const skippingRecords = pageNo - 1 * perPage;
    const posts = await this.postModel
      .find({ categoryId: categories })
      .skip(skippingRecords)
      .limit(perPage)
      .sort({ _id: -1 })
      .exec();
    return posts;
  }

  async getPost({ id }): Promise<Post> {
    const [post] = await this.postModel.find({ id }).exec();
    return post;
  }


  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkPosts({
    categoryId = 1,
    pageNo = 1,
    perPageItems = 100,
  } = {}): Promise<{ posts: WebPostType[]; error?: Error }> {
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
        error: e,
        posts: [],
      };
    }
  }
}

type PostsType = {
  error?: Error;
  posts: Post[];
};

export interface WebPostType extends Omit<Post, 'title' | 'content'> {
  title: { rendered: string };
  content: { rendered: string };
};