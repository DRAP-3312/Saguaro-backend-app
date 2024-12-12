import { Rol } from 'src/user/entities/rol.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  userName: string;

  @Column('text', { select: false })
  password: string;

  @Column('bool')
  isActive: boolean;

  @OneToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToOne(() => Rol, (rol) => rol.auth)
  @JoinColumn({ name: 'idRol' })
  rol: Rol;
}
