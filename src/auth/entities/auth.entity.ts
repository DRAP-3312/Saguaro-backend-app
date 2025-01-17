import { Rol } from 'src/user/entities/rol.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToOne(() => User, (user) => user.auth, { eager: true })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @ManyToOne(() => Rol, (rol) => rol.auth, { eager: true })
  @JoinColumn({name: 'idRol'})
  rol: Rol;
}
