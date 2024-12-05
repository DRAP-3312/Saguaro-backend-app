import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from './board.entity';

@Entity('guest')
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  idUser: string;

  @Column('json')
  permisos: Object;

  @ManyToOne(() => Board, (board) => board.guests)
  @JoinColumn({ name: 'idBoard' })
  board: Board;
}
