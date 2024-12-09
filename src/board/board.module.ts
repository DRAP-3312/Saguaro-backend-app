import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Guest } from './entities/guest.entity';
import { List } from './entities/list.entity';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [TypeOrmModule.forFeature([Board, Guest, List]), WorkspaceModule],
})
export class BoardModule {}
