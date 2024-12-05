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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user/create-user.dto';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from './dto/rol/create-rol.dto';
import { Rol } from './entities/rol.entity';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('rol')
  @ApiResponse({ status: 201, description: 'Rol was created', type: Rol })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  createRol(@Body() creatRolDto: CreateRolDto) {
    return this.userService.createRol(creatRolDto);
  }

  @Get()
  @ApiResponse({ status: 201, description: 'List of users', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  FindAllUser() {
    return this.userService.findAllUser();
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'user', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  FindUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findUserbyId(id);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'User delete successfully', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
