import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/rol/create-rol.dto';
import { User } from './entities/user.entity';
import { exceptionMessage } from 'src/common/expectionsMessage';
import { UpdateUserDto } from './dto/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createRol(createRolDto: CreateRolDto) {
    try {
      await this.findRepitRolbyName(createRolDto.name);
      const newRol = this.rolRepo.create(createRolDto);
      await this.rolRepo.save(newRol);
      return newRol;
    } catch (error) {
      throw error;
    }
  }

  async findRepitRolbyName(name: string): Promise<Rol> {
    const rol = await this.rolRepo.findOne({ where: { name: name } });
    if (rol) throw new BadRequestException(`Name '${name}' already exists`);
    return rol;
  }

  async findRolbyName(name: string): Promise<Rol> {
    return await this.rolRepo.findOne({ where: { name: name } });
  }

  async findAllUser(): Promise<User[]> {
    return await this.userRepo.find({
      relations: { workspace: true },
    });
  }

  async findUserbyId(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { workspace: true, notify: true },
    });
    if (!user) exceptionMessage('User', id, 'notFount', 'id');

    return user;
  }

  async deleteUser(id: string) {
    try {
      const user = await this.findUserbyId(id);
      if (!user) exceptionMessage('User', id, 'notFount', 'id');
      await this.userRepo.remove(user);
      return { messsage: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user: Partial<User> = {
        id,
        ...updateUserDto,
      };
      const userUpdated = await this.userRepo.preload(user);
      await this.userRepo.save(userUpdated);

      return userUpdated;
    } catch (error) {
      throw error;
    }
  }
}
