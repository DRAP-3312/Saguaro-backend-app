import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    example: 'Tareas matematicas',
    default: 'tittle of board',
    minLength: 2,
    maxLength: 50,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  tittle: string;

  @ApiProperty({
    example: 'mis tareas de mate',
    default: 'description of board',
    maxLength: 50,
    nullable: true,
  })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'string',
    nullable: false,
  })
  @IsUUID()
  idUser: string;

  @ApiProperty({
    example: 'string',
    nullable: false,
  })
  @IsUUID()
  idWs: string;
}
