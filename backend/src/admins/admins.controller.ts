import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin-dto';

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
    return { users: await this.adminsService.findAll() };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return { user: await this.adminsService.findOne(id) };
  }
}
