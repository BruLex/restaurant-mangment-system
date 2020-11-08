import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mSchema, Types } from 'mongoose';

import { Dish } from '../../dishes/schemas/dish.schema';

@Schema()
export class DishOrder {
  @Prop({ required: true, type: Types.ObjectId, ref: Dish.name })
  dish: Dish;
  @Prop({ required: true })
  count: number;
}

export type DishOrderDocument = DishOrder & Document;

export const DishOrderSchema: mSchema<DishOrder> = SchemaFactory.createForClass(
  DishOrder,
);

@Schema()
export class Order {
  @Prop([DishOrder])
  dishes: DishOrder[];
}

export type OrderDocument = Order & Document;

export const OrderSchema: mSchema<Order> = SchemaFactory.createForClass(Order);
