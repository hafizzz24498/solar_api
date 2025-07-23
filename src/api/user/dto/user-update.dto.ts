import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    required: false,
    example: 'John',
    description: 'The first name of the user',
  })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsOptional()
  lastName?: string;
}
