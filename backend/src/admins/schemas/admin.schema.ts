import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

@Schema({
  id: true,
  toJSON: {
    virtuals: true,
  },
})
export class Admin {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  password: string;
}

export type AdminDocument = Admin & Document;

export const AdminSchema: mSchema<Admin> = SchemaFactory.createForClass(Admin);
