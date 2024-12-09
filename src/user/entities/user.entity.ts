import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Workspace } from 'src/workspace/entities/workspace.entity';
import { Notification } from 'src/notification/entities/notification.entity';

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

  @ManyToOne(() => Rol, (rol) => rol.user)
  @JoinColumn({ name: 'idRol' })
  rol: Rol;

  @OneToMany(() => Workspace, (ws) => ws.user)
  workspace: Workspace[];

  @OneToMany(() => Notification, (noti) => noti.user)
  notify: Notification[];
}
