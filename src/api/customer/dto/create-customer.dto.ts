import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The address of the customer',
    example: '123 Sukhumvit Rd',
    required: true,
  })
  address: string;

  @IsString()
  @ApiProperty({
    description: 'The province of the customer',
    example: 'Bangkok',
    required: true,
  })
  province: string;

  @IsString()
  @ApiProperty({
    description: 'The phone number of the customer',
    example: '123-456-7890',
    required: true,
  })
  phone: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The latitude of the customer',
    example: 40.7128,
    required: false,
  })
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The longitude of the customer',
    example: -74.006,
    required: false,
  })
  longitude?: number;
}
