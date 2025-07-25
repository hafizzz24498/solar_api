import { ApiProperty } from "@nestjs/swagger";

export class CreateMaintainanceDto {
    @ApiProperty({
        description: 'The type of maintenance',
        example: 'Cleaning',
        required: true,
    })
    type: string;
    @ApiProperty({
        description: 'The priority of the maintenance',
        example: 'High | Medium | Low',
        required: true,
    })
    priority: string;
    @ApiProperty({
        description: 'The scheduled date for the maintenance',
        example: '2023-10-01T10:00:00Z',
        required: true,
    })
    scheduledDate: Date;
    @ApiProperty({
        description: 'The status of the maintenance',
        example: 'Pending | Scheduled | In Progress | Completed',
        required: true,
    })
    status: string;
    @ApiProperty({
        description: 'Additional notes for the maintenance',
        example: 'This is a routine maintenance check.',
        required: false,
    })
    note?: string;
    @ApiProperty({
        description: 'The ID of the customer',
        example: 'customer-123',
        required: true,
    })
    customerId: string;
    @ApiProperty({
        description: 'The ID of the technician',
        example: 'technician-456',
        required: true,
    })
    assignedToId: string;
}
