import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

@Schema({
  id: true,
  toJSON: {
    virtuals: true,
  },
})
export class Dish {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  unit: string;
  @Prop({ required: true })
  price: string;
}

export type DishDocument = Dish & Document;

export const DishSchema: mSchema<Dish> = SchemaFactory.createForClass(Dish);
