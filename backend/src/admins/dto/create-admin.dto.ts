import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  readonly name?: string;
  @MinLength(3)
  @MaxLength(255)
  @IsNotEmpty()
  readonly password?: string;
}
