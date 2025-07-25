import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintainanceDto } from './create-maintainance.dto';

export class UpdateMaintainanceDto extends PartialType(CreateMaintainanceDto) {}
