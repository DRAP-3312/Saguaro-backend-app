import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'uuid',
    nullable: false,
  })
  @IsUUID()
  idList: string;

  @ApiProperty({
    example: 'realizar tarea ingles libro',
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  title: string;

  @ApiProperty({
    example: 'pagina 130 leccion 10 para hoy',
    nullable: true,
  })
  @IsString()
  @MaxLength(150)
  description?: string;

  @ApiProperty({
    example: 'medium',
    nullable: false,
  })
  @IsIn(['low', 'medium', 'high'])
  importance: string;
}
