import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin-dto';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private model: Model<AdminDocument>) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
    const createdAdmin: AdminDocument = new this.model(createAdminDto);
    return createdAdmin.save();
  }

  async update(updateAdminDto: UpdateAdminDto): Promise<AdminDocument> {
    const createdAdmin: AdminDocument = await this.model.findById(
      updateAdminDto.id,
    );
    return createdAdmin.updateOne(updateAdminDto);
  }

  async findAll(): Promise<AdminDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<AdminDocument> {
    return this.model.findById(id).exec();
  }
}
