import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'idUser',
    nullable: false,
  })
  @IsUUID()
  sender: string;

  @ApiProperty({
    example: 'ya acabe!',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  message: string;

  @ApiProperty({
    example: 'uuid',
    nullable: false,
  })
  @IsUUID()
  idTask: string;
}
