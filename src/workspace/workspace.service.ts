import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from './entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { exceptionMessage } from 'src/common/expectionsMessage';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly wsRepo: Repository<Workspace>,
    private readonly dataSource: DataSource,
  ) {}
  async create(
    user: User,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<Workspace> {
    const query = this.dataSource.createQueryRunner();
    query.startTransaction();
    try {
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

  async updateWorkspace(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    try {
      const workspace: Partial<Workspace> = {
        id,
        ...updateWorkspaceDto,
      };

      const updateWS = await this.wsRepo.preload(workspace);
      await this.wsRepo.save(updateWS);
      return updateWS;
    } catch (error) {
      throw error;
    }
  }
}
