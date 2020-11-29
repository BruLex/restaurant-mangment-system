import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin-dto';
import { AdminDocument } from './schemas/admin.schema';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<{ id: string }> {
    const { id } = await this.adminsService.create(createAdminDto);
    return {
      id,
    };
  }

  @Put()
  async update(@Body() updateAdminDto: UpdateAdminDto): Promise<void> {
    await this.adminsService.update(updateAdminDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return { admins: await this.adminsService.findAll() };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return { admin: (await this.adminsService.findOne(id)) ?? [] };
  }
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return (await (await this.adminsService.findOne(id)).remove()).$isDeleted;
  }
}
