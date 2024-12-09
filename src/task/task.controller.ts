import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task/create-task.dto';
import { UpdateTaskDto } from './dto/task/update-task.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { CreateCommentDto } from './dto/comment/create-comment.dto';
import { CommentTask } from './entities/comment.entity';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'task created', type: Task })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Post('comment')
  @ApiResponse({
    status: 201,
    description: 'comment created',
    type: CommentTask,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  createCommentToTask(@Body() createComment: CreateCommentDto) {
    return this.taskService.createCommentTotask(createComment);
  }
}
