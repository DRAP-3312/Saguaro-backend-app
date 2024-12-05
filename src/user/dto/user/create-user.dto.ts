import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'samy',
    description: 'name of user',
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'montana',
    description: 'lastname of user',
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastname: string;

  @ApiProperty({
    example: 'male',
    description: 'gender of user',
    nullable: false,
  })
  @IsIn(['male', 'female', 'notsay'])
  gender: string;

  @ApiProperty({
    example: 'jugar videojuegos',
    description: 'aboutme of user',
    nullable: true,
  })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  aboutme?: string;
}
