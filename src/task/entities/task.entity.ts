import { List } from 'src/board/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentTask } from './comment.entity';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  importance: string;

  @OneToMany(() => CommentTask, (coment) => coment.task, { eager: true })
  comments: CommentTask[];

  @ManyToOne(() => List, (list) => list.tasks)
  @JoinColumn({ name: 'idList' })
  list: List;
}
