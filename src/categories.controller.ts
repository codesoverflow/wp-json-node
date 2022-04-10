import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly appService: CategoriesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
