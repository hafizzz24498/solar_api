import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({
    required: true,
    example: 'john_doe',
    description: 'The username of the user',
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'Password_123',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    required: true,
    example: 'John',
    description: 'The first name of the user',
  })
  firstName: string;

  @ApiProperty({
    required: true,
    example: 'Doe',
    description: 'The last name of the user',
  })
  lastName: string;

  @ApiProperty({
    required: true,
    example: 'admin || technician || subTechnician',
    description: 'The role of the user',
  })
  role: string;

  @ApiProperty({
    required: false,
    description: 'The ID of the parent user',
  })
  parentId?: string;
}
