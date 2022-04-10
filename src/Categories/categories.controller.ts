import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) { }

  @Get()
  getCategories(): Object {
    return this.categoryService.getNetworkCategories();
  }
}
