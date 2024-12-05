import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Board } from './entities/board.entity';
import { Guest } from './entities/guest.entity';
import { PermissionsInter } from './interfaces/permissions.interface';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async create(
    id: string,
    idWs: string,
    createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const permi: PermissionsInter = {
      create: true,
      delete: true,
      move: true,
      reply: true,
      update: true,
    };

    const process = this.dataSource.createQueryRunner();

    process.startTransaction();
    try {
      const user = await process.manager.findOne(User, { where: { id } });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      const ws = await process.manager.findOne(Workspace, {
        where: { id: idWs },
      });
      if (!ws) throw new NotFoundException(`Workspace with id ${id} not found`);

      const guest = process.manager.create(Guest, {
        idUser: user.id,
        permisos: permi,
      });

      await process.manager.save(guest);
      const board = process.manager.create(Board, {
        ...createBoardDto,
        guests: [guest],
        workspace: ws,
        list: [],
      });

      await process.manager.save(board);

      await process.commitTransaction();
      return board;
    } catch (error) {
      await process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }

  async findBoardbyId(id: string): Promise<Board> {
    const board = await this.boardRepo.findOne({
      where: { id },
      relations: { workspace: true, guests: true },
    });

    if (!board) throw new NotFoundException(`Board with id ${id} not found`);
    return board;
  }
}
