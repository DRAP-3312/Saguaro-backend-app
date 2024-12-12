import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/user/create-user.dto';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'paco',
    nullable: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  userName: string;

  @ApiProperty({
    example: 'string',
    nullable: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example: {
      name: 'Paco Aldaba',
      lastname: 'Sanchez Chan',
      gender: 'male',
      aboutme: 'nada',
    },
    nullable: false,
    minLength: 2,
    maxLength: 50
  })
  @IsObject()
  user: CreateUserDto;
}
