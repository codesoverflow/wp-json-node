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
      // id,
      // date,
      // slug,
      title: { rendered: title },
      content: { rendered: content },
      // featured_image_url_td_100x70,
      // categoryId,
      ...rest
    } = postData;
    const finalPost = {
      ...rest,
      // id,
      // date,
      // slug,
      title,
      content,
      // featured_image_url_td_100x70,
      // categoryId,
    };
    const post = new this.postModel(finalPost);
    await post.save();
    return post;
  }

  async getAll({
    categories = 1,
    pageNo = 1,
    perPage = 100,
  }): Promise<PostsType> {
    try {
      const skippingRecords = (pageNo - 1) * perPage;
      const posts = await this.postModel
        .find({ categoryId: categories })
        .skip(skippingRecords)
        .limit(perPage)
        .sort({ id: -1 })
        .exec();
      return { posts };
    } catch (error) {
      return { error, posts: [] };
    }
  }

  async getPost({ id }): Promise<Post> {
    const [post] = await this.postModel.find({ id }).exec();
    return post;
  }

  async getDbPostsAsWebPosts(queries): Promise<WebPostsType> {
    const { error, posts } = await this.getAll(queries);
    //console.log({ posts })
    const webPosts = posts.map((post) => {
      const {
        id,
        date,
        slug,
        link,
        featured_image_url_td_100x70,
        title,
        content,
        categoryId,
      } = post;
      return {
        id,
        date,
        slug,
        link,
        featured_image_url_td_100x70,
        categoryId,
        title: { rendered: title },
        content: { rendered: content },
      };
    });

    return { posts: webPosts, ...(error && { error }) };
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

type WebPostsType = {
  error?: Error;
  posts: WebPostType[];
};