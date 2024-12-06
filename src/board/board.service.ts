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
import { List } from './entities/list.entity';
import { AddListToBoard } from './dto/others/addListToboard.dto';
import { Task } from 'src/task/entities/task.entity';
import { CommentTask } from 'src/task/entities/comment.entity';

@Injectable()
export class BoardService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async create({ idWs, idUser, ...data }: CreateBoardDto): Promise<Board> {
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
      const user = await process.manager.findOne(User, {
        where: { id: idUser },
      });
      if (!user)
        throw new NotFoundException(`User with id ${idUser} not found`);

      const ws = await process.manager.findOne(Workspace, {
        where: { id: idWs },
      });
      if (!ws)
        throw new NotFoundException(`Workspace with id ${idWs} not found`);

      const board = process.manager.create(Board, {
        ...data,
        workspace: ws,
      });

      await process.manager.save(board);

      const guest = process.manager.create(Guest, {
        idUser: user.id,
        permisos: permi,
        board,
      });

      await process.manager.save(guest);
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
    });

    if (!board) throw new NotFoundException(`Board with id ${id} not found`);
    return board;
  }

  async addGuestToBoard(idUser: string, idBoard: string): Promise<Board> {
    const permi: PermissionsInter = {
      create: false,
      delete: false,
      move: false,
      reply: true,
      update: false,
    };
    const process = this.dataSource.createQueryRunner();
    process.startTransaction();
    try {
      const user = await process.manager.findOne(User, {
        where: { id: idUser },
      });
      if (!user)
        throw new NotFoundException(`User with id ${idUser} not found`);

      const board = await process.manager.findOne(Board, {
        where: { id: idBoard },
      });

      if (!board)
        throw new NotFoundException(`Board with id ${idBoard} not found`);

      const guest = process.manager.create(Guest, {
        idUser: user.id,
        permisos: permi,
        board,
      });

      await process.manager.save(guest);
      const updatedBoard = await process.manager.findOne(Board, {
        where: { id: idBoard },
      });
      await process.commitTransaction();

      return updatedBoard;
    } catch (error) {
      await process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }

  async deleteBoard(idBoard: string) {
    const process = this.dataSource.createQueryRunner();
    process.startTransaction();

    try {
      const board = await process.manager.findOne(Board, {
        where: { id: idBoard },
      });

      if (!board)
        throw new NotFoundException(`Board with id ${idBoard} not found`);

      await process.manager.remove(Guest, board.guests);
      const listas = await process.manager.findBy(List, {
        board: { id: idBoard },
      });
      listas.forEach(async (list) => {
        list.tasks.forEach(async (task) => {
          await process.manager.remove(CommentTask, task.comments);
        });
        await process.manager.remove(Task, list.tasks);
      });
      await process.manager.remove(List, board.list);
      await process.manager.remove(Board, board);
      await process.commitTransaction();
      return { message: 'board deleted successfully' };
    } catch (error) {
      await process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }

  async addListToBoard({ idBoard, ...data }: AddListToBoard): Promise<Board> {
    const process = this.dataSource.createQueryRunner();
    process.startTransaction();

    try {
      const board = await process.manager.findOne(Board, {
        where: { id: idBoard },
      });

      if (!board)
        throw new NotFoundException(`Board with id ${idBoard} not found`);

      const list = await process.manager.create(List, {
        ...data,
        board,
      });

      await process.manager.save(list);
      await process.commitTransaction();
      return await process.manager.findOne(Board, { where: { id: idBoard } });
    } catch (error) {
      process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }
}
