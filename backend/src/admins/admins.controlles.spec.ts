import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import * as _ from 'lodash';

import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-test-module';
import { Admin, AdminDocument, AdminSchema } from './schemas/admin.schema';

const testAdmin: { name: string; password: string } = {
  name: 'admin1',
  password: 'admin123',
};

describe('AdminsController', () => {
  let service: AdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
      ],
      providers: [AdminsService],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return a new entity', async () => {
    const admin: AdminDocument = await service.create(testAdmin);
    expect(admin.id).toBeDefined();
    expect(admin._id).toBeDefined();
    expect(_.omit(admin.toObject(), ['id', '_id', '__v'])).toEqual(testAdmin);
  });

  it('Should return a list of entities', async () => {
    const admin: AdminDocument = await service.create(testAdmin);
    const admins: AdminDocument[] = await service.findAll();
    expect(admins.length).toBeGreaterThan(0);
    expect(admins.map((a) => a.toObject())).toEqual([admin.toObject()]);
  });

  it('Should return one entity by id', async () => {
    const newAdmin: AdminDocument = await service.create(testAdmin);
    expect((await service.findOne(newAdmin.id)).toObject()).toEqual(
      newAdmin.toObject(),
    );
  });

  it('Should change created entity', async () => {
    const newAdmin: AdminDocument = await service.create(testAdmin);
    const newName: string = 'adminNewName';
    await service.update({ id: newAdmin.id, name: newName });
    expect((await service.findOne(newAdmin.id)).toObject()).toEqual({
      ...newAdmin.toObject(),
      name: newName,
    });
  });
});
