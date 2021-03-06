import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<void> {
    await this.ordersService.create(createOrderDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<any> {
    return { order: await this.ordersService.findOne(id) };
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return (await (await this.ordersService.findOne(id)).remove()).$isDeleted;
  }
}
