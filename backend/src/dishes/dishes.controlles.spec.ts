import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-module';
import { Dish, DishDocument, DishSchema } from './schemas/dish.schema';
import { CreateDishDto } from './dto/create-dish.dto';

const testDish: { unit: string; price: number; name: string } = {
  name: 'dish1',
  unit: 'kg',
  price: 0.12,
};

describe('DishesController', () => {
  let service: DishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }]),
      ],
      providers: [DishesService],
    }).compile();

    service = module.get<DishesService>(DishesService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a new entity', async () => {
    const dish: DishDocument = await service.create(testDish as CreateDishDto);
    expect(dish.id).toBeDefined();
    expect(dish._id).toBeDefined();
    expect(_.omit(dish.toObject(), ['id', '_id', '__v'])).toEqual(testDish);
  });

  it('Should return a list of entities', async () => {
    const dish: DishDocument = await service.create(testDish);
    const dishes: DishDocument[] = await service.findAll();
    expect(dishes.length).toBeGreaterThan(0);
    expect(dishes.map((a) => a.toObject())).toEqual([dish.toObject()]);
  });

  it('Should return one entity by id', async () => {
    const newDish: DishDocument = await service.create(testDish);
    expect((await service.findOne(newDish.id)).toObject()).toEqual(
      newDish.toObject(),
    );
  });

  it('Should change created entity', async () => {
    const newDish: DishDocument = await service.create(testDish);
    const newName: string = 'dishNewName';
    await service.update({ id: newDish.id, name: newName });
    expect((await service.findOne(newDish.id)).toObject()).toEqual({
      ...newDish.toObject(),
      name: newName,
    });
  });
});
