import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish-dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async create(@Body() createDishDto: CreateDishDto): Promise<{ id: string }> {
    const { id } = await this.dishesService.create(createDishDto);
    return {
      id,
    };
  }

  @Put()
  async update(@Body() updateDishDto: UpdateDishDto): Promise<void> {
    await this.dishesService.update(updateDishDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return { dishes: await this.dishesService.findAll() };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return { dish: await this.dishesService.findOne(id) };
  }
}
