import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [TypeOrmModule.forFeature([Workspace])],
})
export class WorkspaceModule {}
