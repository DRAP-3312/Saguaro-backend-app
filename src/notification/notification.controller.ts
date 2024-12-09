import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Notification } from './entities/notification.entity';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Notification was created',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Notification found',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  finNotibyId(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.findNotibyId(id);
  }
}
