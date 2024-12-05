import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Board } from './entities/board.entity';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post(':idUser/:idWs')
  @ApiResponse({ status: 201, description: 'board created', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(
    @Param('idUser', ParseUUIDPipe) idUser: string,
    @Param('idWs', ParseUUIDPipe) idWs: string,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardService.create(idUser, idWs, createBoardDto);
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'board found', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.findBoardbyId(id);
  }
}
