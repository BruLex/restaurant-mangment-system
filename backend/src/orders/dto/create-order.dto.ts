import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDishEntityDto {
  @IsString()
  @IsNotEmpty()
  readonly dish: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly count: number;
}

export class CreateOrderDto {
  @ArrayMinSize(1)
  @ValidateNested()
  readonly dishes: CreateOrderDishEntityDto[];
}
