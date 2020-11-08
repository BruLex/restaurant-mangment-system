import {
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateWaiterDto {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
