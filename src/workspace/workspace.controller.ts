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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Workspace } from './entities/workspace.entity';
import { AuthProtected, GetUser } from 'src/auth/decorators';
import { User } from 'src/user/entities/user.entity';
import { ValidRole } from 'src/auth/interfaces/roles-protect.interface';

@Controller('workspace')
@ApiTags('Workspace')
@ApiBearerAuth('access-token')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @AuthProtected(ValidRole.USER)
  @ApiResponse({ status: 201, description: 'board created', type: Workspace })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  create(
    @GetUser('user') user: User,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspaceService.create(user, createWorkspaceDto);
  }

  @Get()
  @AuthProtected(ValidRole.USER)
  @ApiResponse({
    status: 201,
    description: 'list of workspaces',
    type: Workspace,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  findAll(@GetUser('user') { id }: User) {
    return this.workspaceService.findAll(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 201, description: 'board updated', type: Workspace })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  updateWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspaceService.updateWorkspace(id, updateWorkspaceDto);
  }
}
