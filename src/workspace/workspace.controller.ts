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
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Workspace } from './entities/workspace.entity';

@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post(':idUser')
  @ApiResponse({ status: 201, description: 'board created', type: Workspace })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(
    @Param('idUser', ParseUUIDPipe) idUser: string,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.create(idUser, createWorkspaceDto);
  }

  @Get()
  @ApiResponse({
    status: 201,
    description: 'list of workspaces',
    type: Workspace,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findAll() {
    return this.workspaceService.findAll();
  }
}
