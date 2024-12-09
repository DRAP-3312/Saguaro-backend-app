import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  type: string;

  @Column('text', { nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.notify)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @Column('text', { nullable: true })
  sender?: string;
}
