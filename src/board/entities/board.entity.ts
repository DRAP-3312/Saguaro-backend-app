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

  @OneToMany(() => List, (list) => list.board, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  list: List[];

  @OneToMany(() => Guest, (guest) => guest.board, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  guests: Guest[];

  @ManyToOne(() => Workspace, (ws) => ws.boards, { eager: true })
  @JoinColumn({ name: 'idWorkspace' })
  workspace: Workspace;
}
