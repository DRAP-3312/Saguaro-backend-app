import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'Tareas uni',
    description: 'name of workspace',
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
