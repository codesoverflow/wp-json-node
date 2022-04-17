import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  id: number;

  @Prop()
  categoryId: number;

  @Prop()
  date: string;

  @Prop()
  slug: string;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  featured_image_url_td_100x70: string;

  @Prop()
  link: string;
}

export const postsDocumentName = 'posts';

export const PostSchema = SchemaFactory.createForClass(Post);