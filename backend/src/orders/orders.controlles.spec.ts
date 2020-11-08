import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-module';
import { Order, OrderDocument, OrderSchema } from './schemas/order.schema';
import { Dish, DishDocument, DishSchema } from '../dishes/schemas/dish.schema';
import { DishesService } from '../dishes/dishes.service';

describe('OrdersController', () => {
  let service: OrdersService;

  let dishes: DishDocument[];

  let testOrder: { dishes: { dish: string; count: number }[] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Order.name, schema: OrderSchema },
          { name: Dish.name, schema: DishSchema },
        ]),
      ],
      providers: [DishesService, OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    const dishesSrv: DishesService = module.get<DishesService>(DishesService);

    dishes = [
      await dishesSrv.create({
        name: 'dish 1',
        price: 0.1,
        unit: 'unit 1',
      }),
      await dishesSrv.create({
        name: 'dish 2',
        price: 0.2,
        unit: 'unit 2',
      }),
    ];
    testOrder = {
      dishes: [2, 3].map((count, i) => ({ dish: dishes[i].id, count })),
    };
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a new entity', async () => {
    const order: OrderDocument = await service.create(testOrder);
    expect(order.id).toBeDefined();
    expect(order._id).toBeDefined();
    expect(
      _.omit(order.toObject(), [
        'id',
        '_id',
        '__v',
        'dishes[0]._id',
        'dishes[1]._id',
      ]),
    ).toEqual(testOrder);
  });

  it('Should return a list of entities', async () => {
    const order: OrderDocument = await service.create(testOrder);
    const orders: OrderDocument[] = await service.findAll();
    expect(orders.length).toEqual(1);
    expect(orders.map((a) => a.toObject())).toEqual([
      {
        ...order.toObject(),
        dishes: order.toObject().dishes.map((dishRaw) => ({
          ...dishRaw,
          dish: dishes.find(({ id }) => id === dishRaw.dish).toObject(),
        })),
      },
    ]);
  });

  it('Should return one entity by id', async () => {
    const newOrder: OrderDocument = await service.create(testOrder);
    expect(
      _.omit((await service.findOne(newOrder.id)).toObject(), ['__v', '_id']),
    ).toEqual({
      dishes: newOrder.toObject().dishes.map((dishRaw) => ({
        ...dishRaw,
        count: dishRaw.count,
        dish: dishes.find(({ id }) => id === dishRaw.dish).toObject(),
      })),
    });
  });
});
