import { forwardRef, Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { LoginModule } from 'src/login/login.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { HttpExceptionFilter } from 'src/utils/http-exeption.filter';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [
    TypeOrmModule.forFeature([Board]),
    forwardRef(() => LoginModule),
    TasksModule,
    HttpExceptionFilter,
  ],
  exports: [TypeOrmModule],
})
export class BoardsModule {}
