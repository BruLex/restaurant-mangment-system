import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Waiter, WaiterDocument } from './schemas/waiter.schema';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { UpdateWaiterDto } from './dto/update-waiter-dto';

@Injectable()
export class WaitersService {
  constructor(@InjectModel(Waiter.name) private model: Model<WaiterDocument>) {}

  async create(createWaiterDto: CreateWaiterDto): Promise<WaiterDocument> {
    const createdWaiter: WaiterDocument = new this.model(createWaiterDto);
    return createdWaiter.save();
  }

  async update(updateWaiterDto: UpdateWaiterDto): Promise<WaiterDocument> {
    const createdWaiter: WaiterDocument = await this.model.findById(
      updateWaiterDto.id,
    );
    return createdWaiter.updateOne(updateWaiterDto);
  }

  async findAll(): Promise<WaiterDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<WaiterDocument> {
    return this.model.findById(id).exec();
  }
}
