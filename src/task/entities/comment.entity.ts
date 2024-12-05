import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('comment')
export class CommentTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  sender: string;

  @Column('text')
  message: string;

  @Column('date')
  date: Date;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'idTask' })
  task: Task;
}
