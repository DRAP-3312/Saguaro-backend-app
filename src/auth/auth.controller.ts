import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GetUser, AuthProtected } from './decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRole } from './interfaces/roles-protect.interface';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Register was created', type: Auth })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'Login successfully', type: Auth })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  loginUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiResponse({ status: 201, description: 'test ok' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @Get('check-status')
  @AuthProtected(ValidRole.USER)
  testPrivateRoute(@GetUser() user: User) {
    return this.authService.checkStatus(true, 'Usuario Autorizado', user)
  }
}
