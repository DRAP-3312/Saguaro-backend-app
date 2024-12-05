import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    example: 'user',
    nullable: false,
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;
}
