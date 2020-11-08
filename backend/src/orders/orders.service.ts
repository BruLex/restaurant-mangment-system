import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  DishOrderDocument,
  Order,
  OrderDocument,
} from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Dish } from '../dishes/schemas/dish.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private model: Model<OrderDocument>) {}

  async create(createCatDto: CreateOrderDto): Promise<Order> {
    const createdCat: OrderDocument = new this.model(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Order[]> {
    return this.model.find().populate('dishes.dish').exec();
  }
  async findOne(id: string): Promise<Order> {
    return this.model.findById(id).populate('dishes.dish').exec();
  }
}
