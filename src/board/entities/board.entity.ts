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

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  tittle: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  list: string[];

  @OneToMany(() => Guest, (guest) => guest.board)
  guests: Guest[];

  @ManyToOne(() => Workspace, (ws) => ws.boards)
  @JoinColumn({ name: 'idWorkspace' })
  workspace: Workspace;
}
