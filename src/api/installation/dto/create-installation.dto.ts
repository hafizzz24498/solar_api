import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

// Define InstallStatus enum locally if not exported from @prisma/client
export enum InstallStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateInstallationDto {
  @IsString()
  @ApiProperty({
    description: 'The ID of the customer for the installation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @IsString()
  @ApiProperty({
    description: 'The ID of the technician for the installation',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: true,
  })
  technicianId: string;

  @IsNumber()
  @ApiProperty({
    description: 'The number of solar panels for the installation',
    example: 10,
    required: true,
  })
  panels: number;

  @IsNumber()
  @ApiProperty({
    description: 'The capacity of the installation in kW',
    example: 5.5,
    required: true,
  })
  capacityKW: number;

  @IsString()
  @ApiProperty({
    description: 'The status of the installation',
    example: 'PENDING',
    required: true,
  })
  status: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The efficiency of the installation',
    example: 90,
    required: true
  })
  efficiency: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The date of the next maintenance for the installation',
    example: '2023-06-15T00:00:00.000Z',
    required: false,
  })
  nextMaintenance?: string;
}
