import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDishDto {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @MinLength(1)
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  readonly unit: string;
  @Min(0.000001)
  @IsNotEmpty()
  readonly price: number;
}
