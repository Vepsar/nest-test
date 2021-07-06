import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
  // Res,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { loginGuard } from 'src/login/login.guard';

@Controller('boards/:boardid/tasks')
@UseGuards(loginGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('boardid') boardId: string,
  ) {
    return this.tasksService.create(boardId, createTaskDto);
  }

  @Get()
  findAll(@Param('boardid') boardId: string) {
    return this.tasksService.findAll(boardId);
  }

  @Get(':taskid')
  findOne(@Param('taskid') taskId: string, @Param('boardid') boardId: string) {
    return this.tasksService.findOne(boardId, taskId);
  }

  @Put(':taskid')
  update(
    @Param('taskid') taskId: string,
    @Param('boardid') boardId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(boardId, taskId, updateTaskDto);
  }

  @Delete(':taskid')
  remove(@Param('taskid') id: string, @Res() res: Response) {
    return this.tasksService.remove(id, res);
  }
}
