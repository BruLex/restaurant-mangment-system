import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

import { WaitersController } from './waiters.controller';
import { WaitersService } from './waiters.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-module';
import { Waiter, WaiterDocument, WaiterSchema } from './schemas/waiter.schema';
import { CreateWaiterDto } from './dto/create-waiter.dto';

const testWaiter: { name: string; password: string } = {
  name: 'waiter1',
  password: 'waiter123',
};

describe('WaitersController', () => {
  let service: WaitersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Waiter.name, schema: WaiterSchema },
        ]),
      ],
      providers: [WaitersService],
    }).compile();

    service = module.get<WaitersService>(WaitersService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a new entity', async () => {
    const waiter: WaiterDocument = await service.create(
      testWaiter as CreateWaiterDto,
    );
    expect(waiter.id).toBeDefined();
    expect(waiter._id).toBeDefined();
    expect(_.omit(waiter.toObject(), ['id', '_id', '__v'])).toEqual(testWaiter);
  });

  it('Should return a list of entities', async () => {
    const waiter: WaiterDocument = await service.create(testWaiter);
    const waiters: WaiterDocument[] = await service.findAll();
    expect(waiters.length).toBeGreaterThan(0);
    expect(waiters.map((a) => a.toObject())).toEqual([waiter.toObject()]);
  });

  it('Should return one entity by id', async () => {
    const newWaiter: WaiterDocument = await service.create(testWaiter);
    expect((await service.findOne(newWaiter.id)).toObject()).toEqual(
      newWaiter.toObject(),
    );
  });

  it('Should change created entity', async () => {
    const newWaiter: WaiterDocument = await service.create(testWaiter);
    const newName: string = 'waiterNewName';
    await service.update({ id: newWaiter.id, name: newName });
    expect((await service.findOne(newWaiter.id)).toObject()).toEqual({
      ...newWaiter.toObject(),
      name: newName,
    });
  });
});
