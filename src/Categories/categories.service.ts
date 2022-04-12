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

  async get({ id }): Promise<Category> {
    const [category] = await this.categoryModel.find({ id }).exec();
    return category;
  }

  async update({ id, count }: { id: number; count: number }): Promise<boolean> {
    await this.categoryModel.updateOne({ id }, { count });
    return true;
  }

  async getAll(): Promise<CategoriesType> {
    try {
      const categories = await this.categoryModel.find().exec();
      return {
        categories,
      };
    } catch (error) {
      return {
        error,
        categories: [],
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkCategories(): Promise<CategoriesType> {
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
        error: e,
        categories: [],
      };
    }
  }

}

export type CategoriesType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  error?: Object;
  categories: Category[];
};