import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommonFilter } from 'src/shared/common-filter';

export class CustomerFilterDto extends CommonFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;
}
