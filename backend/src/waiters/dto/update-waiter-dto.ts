import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateWaiterDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  readonly name?: string;
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  readonly password?: string;
}
