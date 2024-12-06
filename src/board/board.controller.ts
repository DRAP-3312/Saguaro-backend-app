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
import { AddGuestToBoard } from './dto/others/addGuesttoBoard.dto';
import { AddListToBoard } from './dto/others/addListToboard.dto';
import { List } from './entities/list.entity';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'board created', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'board found', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.findBoardbyId(id);
  }

  @Post('addguest')
  @ApiResponse({
    status: 201,
    description: 'add guest to board successfully',
    type: Board,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  addGuestToBoard(@Body() { idBoard, idUser }: AddGuestToBoard) {
    return this.boardService.addGuestToBoard(idUser, idBoard);
  }

  @Post('addList')
  @ApiResponse({
    status: 201,
    description: 'add list to board successfully',
    type: List,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  AddListToBoard(@Body() addList: AddListToBoard) {
    return this.boardService.addListToBoard(addList);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'delete board successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  deleteBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.deleteBoard(id);
  }
}
