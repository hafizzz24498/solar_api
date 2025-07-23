import { ApiProperty } from '@nestjs/swagger';
import { StaticRole } from './static-role.enum';
import { IsOptional } from 'class-validator';
import { CommonFilter } from 'src/shared/common-filter';

export class UserFilterDto extends CommonFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  fullname: string;

  @ApiProperty({ required: false })
  @IsOptional()
  username: string;

  @ApiProperty({ required: false, enum: StaticRole })
  @IsOptional()
  role: StaticRole;
}
