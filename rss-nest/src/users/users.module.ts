import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { LoginModule } from 'src/login/login.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LoginModule)],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
