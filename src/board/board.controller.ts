import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Board } from './entities/board.entity';
import { AddGuestToBoard } from './dto/others/addGuesttoBoard.dto';
import { AddListToBoard } from './dto/others/addListToboard.dto';
import { List } from './entities/list.entity';
import { AuthProtected, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRole } from 'src/auth/interfaces/roles-protect.interface';

@ApiTags('Board')
@Controller('board')
@ApiBearerAuth('access-token')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @AuthProtected(ValidRole.USER)
  @ApiResponse({ status: 201, description: 'board created', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createBoardDto: CreateBoardDto, @GetUser('user') user: User) {
    return this.boardService.create(createBoardDto, user);
  }

  @Get(':idWS')
  @AuthProtected(ValidRole.USER)
  @ApiResponse({
    status: 201,
    description: 'board found by Workspace',
    type: Board,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findBoardByWs(@Param('idWS', ParseUUIDPipe) idWS: string) {
    return this.boardService.getBoardByWs(idWS);
  }

  @Get(':id')
  @AuthProtected(ValidRole.USER)
  @ApiResponse({ status: 201, description: 'board found', type: Board })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.findBoardbyId(id);
  }

  @Post('addguest')
  @AuthProtected(ValidRole.USER)
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
  @AuthProtected(ValidRole.USER)
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
  @AuthProtected(ValidRole.USER)
  @ApiResponse({
    status: 200,
    description: 'delete board successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  deleteBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.deleteBoard(id);
  }
}
