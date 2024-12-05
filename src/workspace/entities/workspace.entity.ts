import { Board } from 'src/board/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @OneToMany(() => Board, (board) => board.workspace)
  boards: Board[];

  @ManyToOne(() => User, (user) => user.workspace)
  @JoinColumn({ name: 'idUser' })
  user: User;
}
