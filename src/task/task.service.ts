import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/task/create-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { List } from 'src/board/entities/list.entity';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { CommentTask } from './entities/comment.entity';
import { exceptionMessage } from 'src/common/expectionsMessage';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  async create({ idList, ...data }: CreateTaskDto): Promise<Task> {
    const process = this.dataSource.createQueryRunner();
    process.startTransaction();
    try {
      const list = await process.manager.findOne(List, {
        where: { id: idList },
      });
      if (!list) exceptionMessage('List', idList, 'notFount', 'id');

      const task = process.manager.create(Task, {
        ...data,
        list,
      });

      await process.manager.save(task);
      await process.commitTransaction();
      return task;
    } catch (error) {
      await process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }

  async createCommentTotask({
    idTask,
    sender,
    ...data
  }: CreateCommentDto): Promise<CommentTask> {
    const process = this.dataSource.createQueryRunner();
    process.startTransaction();

    try {
      const task = await process.manager.findOne(Task, {
        where: { id: idTask },
      });
      if (!task) exceptionMessage('Task', idTask, 'notFount', 'id');

      const user = await process.manager.findOne(User, {
        where: { id: sender },
      });

      if (!user) exceptionMessage('Sender', sender, 'notFount', 'id');

      const comment = process.manager.create(CommentTask, {
        ...data,
        task,
        sender,
        date: new Date().toISOString(),
      });

      await process.manager.save(comment);
      await process.commitTransaction();

      return comment;
    } catch (error) {
      await process.rollbackTransaction();
      throw error;
    } finally {
      process.release();
    }
  }
}
