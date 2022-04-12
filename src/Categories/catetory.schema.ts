import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop()
  id: number;

  @Prop()
  count: number;

  @Prop()
  slug: string;

  @Prop()
  appImage: string;

  @Prop()
  orderNo: number;

  @Prop()
  showCategory: number;
}

export const documentName = 'categories';

export const CategorySchema = SchemaFactory.createForClass(Category);