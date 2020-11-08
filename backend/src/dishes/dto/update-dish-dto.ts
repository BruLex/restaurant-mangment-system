import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDishDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @ApiProperty({
    minLength: 3,
    maxLength: 255,
  })
  readonly name: string;
  @ApiProperty({
    minLength: 1,
    maxLength: 64,
  })
  readonly unit: string;
  @ApiProperty({
    minimum: 0,
  })
  readonly price: string;
}
