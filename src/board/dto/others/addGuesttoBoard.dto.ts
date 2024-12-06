import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddGuestToBoard {
  @ApiProperty({
    example: 'string',
    description: 'iduser to add as guest',
  })
  @IsUUID()
  idUser: string;

  @ApiProperty({
    example: 'string',
    description: 'idboard when we add the guest',
  })
  @IsUUID()
  idBoard: string;
}
