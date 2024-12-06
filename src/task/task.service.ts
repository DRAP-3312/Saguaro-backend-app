import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { List } from 'src/board/entities/list.entity';

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
      if (!list)
        throw new NotFoundException(`list with id ${idList} not found`);

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
}
