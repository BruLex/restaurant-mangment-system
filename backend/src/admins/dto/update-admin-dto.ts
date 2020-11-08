import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @MinLength(3)
  @MaxLength(255)
  readonly name?: string;
  @MinLength(3)
  @MaxLength(255)
  readonly password?: string;
}
