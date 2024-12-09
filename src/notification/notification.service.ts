import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { exceptionMessage } from 'src/common/expectionsMessage';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly useRepo: Repository<User>,
  ) {}
  async create({
    idUser,
    sender,
    type,
    ...data
  }: CreateNotificationDto): Promise<Notification> {
    try {
      let userSender;
      const user = await this.useRepo.findOneBy({ id: idUser });
      if (!user) exceptionMessage('User', idUser, 'notFount', 'id');

      if (type === 'comment') {
        userSender = await this.useRepo.findOneBy({ id: sender });
        if (!userSender) exceptionMessage('User', sender, 'notFount', 'id');
      }
      const notify = await this.notiRepo.create({
        ...data,
        sender,
        user,
        type,
      });

      await this.notiRepo.save(notify);
      return notify;
    } catch (error) {
      throw error;
    }
  }

  async findNotibyId(id: string): Promise<Notification> {
    const noti = await this.notiRepo.findOneBy({ id });
    if (!noti) exceptionMessage('Notification', id, 'notFount', 'id');
    return noti;
  }
}
