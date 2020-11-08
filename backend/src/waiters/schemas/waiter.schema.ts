import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

@Schema({
  id: true,
  toJSON: {
    virtuals: true,
  },
})
export class Waiter {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  password: string;
}

export type WaiterDocument = Waiter & Document;

export const WaiterSchema: mSchema<Waiter> = SchemaFactory.createForClass(
  Waiter,
);
