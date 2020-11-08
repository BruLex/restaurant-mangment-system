import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Dish, DishDocument } from './schemas/dish.schema';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish-dto';

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish.name) private model: Model<DishDocument>) {}

  async create(createDishDto: CreateDishDto): Promise<DishDocument> {
    const createdDish: DishDocument = new this.model(createDishDto);
    return createdDish.save();
  }

  async update(updateDishDto: UpdateDishDto): Promise<DishDocument> {
    const createdDish: DishDocument = await this.model.findById(
      updateDishDto.id,
    );
    return createdDish.updateOne(updateDishDto);
  }

  async findAll(): Promise<DishDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<DishDocument> {
    return this.model.findById(id).exec();
  }
}
