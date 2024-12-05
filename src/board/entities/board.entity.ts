import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Guest } from './guest.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { List } from './list.entity';

@Entity('board')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  tittle: string;

  @Column('text')
  description: string;

  @OneToMany(() => List, (list) => list.board)
  list: List[];

  @OneToMany(() => Guest, (guest) => guest.board)
  guests: Guest[];

  @ManyToOne(() => Workspace, (ws) => ws.boards)
  @JoinColumn({ name: 'idWorkspace' })
  workspace: Workspace;
}
