import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'assigned',
    description: 'type of notification',
    nullable: false,
  })
  @IsIn(['comment', 'assigned'])
  type: string;

  @ApiProperty({
    example: 'nueva tarea',
    description: 'description of notification',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'uuid',
    description: 'user to send notification',
    nullable: false,
  })
  @IsUUID()
  idUser: string;

  @ApiProperty({
    example: 'uuid',
    description: 'sender of notification',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  sender?: string;
}
