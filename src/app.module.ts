import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { CategoriesController } from './Categories/categories.controller';
import { CategoriesService } from './Categories/categories.service';
import { documentName, CategorySchema } from './Categories/catetory.schema';

import { PostsController } from './Posts/posts.controller';
import { PostsService } from './Posts/posts.service';
import { postsDocumentName, PostSchema } from './Posts/posts.schema';
import { PostsLoaderService } from './Posts/postsLoader.service';

require('isomorphic-fetch');
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    MongooseModule.forFeature([{ name: documentName, schema: CategorySchema }]),
    MongooseModule.forFeature([
      { name: postsDocumentName, schema: PostSchema },
    ]),
  ],
  controllers: [CategoriesController, PostsController],
  providers: [CategoriesService, PostsService, PostsLoaderService],
})
export class AppModule { }
