import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddListToBoard {
  @ApiProperty({
    example: 'uuid',
    nullable: false,
  })
  @IsUUID()
  idBoard: string;

  @ApiProperty({
    example: 'Tareas por hacer',
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  tittle: string;

  @ApiProperty({
    example: '120,20',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  position?: string;
}
