import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CommonFilter } from 'src/shared/common-filter';

export class InstallationFilterDto extends CommonFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}
