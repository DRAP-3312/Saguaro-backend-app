import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
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
import { exceptionMessage } from 'src/common/expectionsMessage';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { relations } from 'src/common/foundRelationArray';

@Injectable()
export class BoardService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    private readonly wsService: WorkspaceService,
  ) {}

  async create(
    { idWs, ...data }: CreateBoardDto,
    userCurrent: User,
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
      // const user = await process.manager.findOne(User, {
      //   where: { id: idUser },
      //   relations: { workspace: true },
      // });
      // if (!user) exceptionMessage('User', idUser, 'notFount', 'id');

      const ws = await process.manager.findOne(Workspace, {
        where: { id: idWs },
      });
      if (!ws) exceptionMessage('Workspace', idWs, 'notFount', 'id');

      if (!relations(userCurrent.workspace, ws, 'id'))
        throw new BadRequestException(
          'El usuario no es propietario del Workspace',
        );

      const board = process.manager.create(Board, {
        ...data,
        workspace: ws,
      });

      await process.manager.save(board);

      const guest = process.manager.create(Guest, {
        idUser: userCurrent.id,
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

    if (!board) exceptionMessage('Board', id, 'notFount', 'id');
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
      if (!user) exceptionMessage('User', idUser, 'notFount', 'id');

      const board = await process.manager.findOne(Board, {
        where: { id: idBoard },
      });

      if (!board) exceptionMessage('Board', idBoard, 'notFount', 'id');

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

      if (!board) exceptionMessage('Board', idBoard, 'notFount', 'id');

      const deleteComments = board.list.flatMap((list) =>
        list.tasks.flatMap((task) =>
          task.comments.map((comment) =>
            process.manager.remove(CommentTask, comment),
          ),
        ),
      );
      await Promise.all(deleteComments);

      const deleteTasks = board.list.flatMap((list) =>
        process.manager.remove(Task, list.tasks),
      );
      await Promise.all(deleteTasks);

      await process.manager.remove(List, board.list);

      await process.manager.remove(Guest, board.guests);

      await process.manager.remove(Board, board);

      await process.commitTransaction();
      return { message: 'Board deleted successfully' };
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

      if (!board) exceptionMessage('Board', idBoard, 'notFount', 'id');

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
