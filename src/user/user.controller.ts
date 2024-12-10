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
import { UpdateUserDto } from './dto/user/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Patch(':id')
  @ApiResponse({ status: 201, description: 'User update', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'User delete successfully',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
