import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument, documentName } from './catetory.schema';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(documentName) private categoryModel: Model<CategoryDocument>,
  ) { }

  async create(createCatDto: any): Promise<Category> {
    const createdCat = new this.categoryModel(createCatDto);
    return createdCat.save();
  }

  async getAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkCategories(): Promise<Object> {
    const categoriesPath = `${process.env.HOST}${process.env.JSON_PATH}${process.env.CATEGORY_PATH}`
    try {

      const response = await fetch(categoriesPath);
      const { status } = response;
      if (status === 200) {
        const categories = await response.json();
        return {
          categories,
        };
      }

      return {
        categories: [],
      };
    } catch (e) {
      return {
        categoriesPath,
        error: e,
        categories: [],
      };
    }
  }

}
