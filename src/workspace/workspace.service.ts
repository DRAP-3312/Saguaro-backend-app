import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly wsRepo: Repository<Workspace>,
    // @InjectRepository(User)
    // private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  async create(
    iduser: string,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const query = this.dataSource.createQueryRunner();
    query.startTransaction();
    try {
      const user = await query.manager.findOne(User, {
        where: { id: iduser },
        relations: { rol: true, workspace: true },
      });

      if (!user)
        throw new NotFoundException(`User with id ${iduser} not found`);

      const ws = query.manager.create(Workspace, {
        ...createWorkspaceDto,
        user,
        boards: [],
      });

      await query.manager.save(ws);
      await query.commitTransaction();
      return ws;
    } catch (error) {
      await query.rollbackTransaction();
      throw error;
    } finally {
      query.release();
    }
  }

  async findAll(): Promise<Workspace[]> {
    return await this.wsRepo.find({ relations: { boards: true, user: true } });
  }
}
