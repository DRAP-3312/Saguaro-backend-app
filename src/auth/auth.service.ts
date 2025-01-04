import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Rol } from 'src/user/entities/rol.entity';
import { Auth } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}
  async register({ user, password, userName }: RegisterAuthDto) {
    const proccess = this.dataSource.createQueryRunner();
    proccess.startTransaction();
    try {

      const rol = await proccess.manager.findOneBy(Rol, { name: 'user' });
      
      const createUser = proccess.manager.create(User, user);
      await proccess.manager.save(createUser);

      const newRegister = proccess.manager.create(Auth, {
        password: bcrypt.hashSync(password, 10),
        userName,
        isActive: true,
        rol,
        user: createUser,
      });

      await proccess.manager.save(newRegister);
      await proccess.commitTransaction();

      return {
        ok: true,
        message: 'Usuario registrado correctamente'
      };
    } catch (error) {
      await proccess.rollbackTransaction();
      throw error;
    } finally {
      proccess.release();
    }
  }

  async login({ password, userName }: LoginDto) {
    const user = await this.authRepo.findOne({
      where: { userName, isActive: true },
      select: { password: true, userName: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Credentials are not  valid');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not  valid');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  checkStatus(ok:boolean, message:string, user:User){
    const token = this.getJwtToken({id: user.id})

    return {
      ok,
      message,
      user,
      token
    }
  }
}
