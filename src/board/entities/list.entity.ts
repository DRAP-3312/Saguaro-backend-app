import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity('list')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  tittle: string;

  @Column('text')
  position: string;

  @OneToMany(() => Task, (task) => task.list, { eager: true })
  tasks: Task[];

  @ManyToOne(() => Board, (board) => board.list)
  @JoinColumn({ name: 'idboard' })
  board: Board;
}
