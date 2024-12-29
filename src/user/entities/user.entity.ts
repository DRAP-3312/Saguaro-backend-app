import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text')
  gender: string;

  @Column('text')
  aboutme: string;

  @OneToMany(() => Workspace, (ws) => ws.user, { eager: true })
  workspace: Workspace[];

  @OneToMany(() => Notification, (noti) => noti.user)
  notify: Notification[];

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}
