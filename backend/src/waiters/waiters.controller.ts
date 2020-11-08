import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { WaitersService } from './waiters.service';
import { CreateWaiterDto } from './dto/create-waiter.dto';
import { UpdateWaiterDto } from './dto/update-waiter-dto';

@Controller('waiters')
export class WaitersController {
  constructor(private readonly waitersService: WaitersService) {}

  @Post()
  async create(
    @Body() createWaiterDto: CreateWaiterDto,
  ): Promise<{ id: string }> {
    const { id } = await this.waitersService.create(createWaiterDto);
    return {
      id,
    };
  }

  @Put()
  async update(@Body() updateWaiterDto: UpdateWaiterDto): Promise<void> {
    await this.waitersService.update(updateWaiterDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return { users: await this.waitersService.findAll() };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return { user: await this.waitersService.findOne(id) };
  }
}