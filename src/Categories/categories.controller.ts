import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) { }

  @Get()
  async getCategories(): Promise<Object> {
    const { categories, error } = await this.categoryService.getAll();
    if (error) {
      error;
    }
    return categories;
  }
}
