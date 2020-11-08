import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDishDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class CreateOrderDishEntityDto {
  @ValidateNested()
  readonly dish: CreateOrderDishDto;
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
