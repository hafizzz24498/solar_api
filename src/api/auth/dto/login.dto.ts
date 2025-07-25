import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty({
        description: 'The username of the user',
        required: true,
        example: 'weat',
    })
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        required: true,
        example: 'Password_123',
    })
    password: string;
}