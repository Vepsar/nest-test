import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormconfig from './common/ormconfig';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(ormconfig), BoardsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
