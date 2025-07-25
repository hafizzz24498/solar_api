import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsDateString()
  @ApiProperty({
    description: 'The last clean date of the customer solar panels',
    example: '2025-01-01T00:00:00.000Z',
    required: true,
  })
  lastCleanDate: string;
}
