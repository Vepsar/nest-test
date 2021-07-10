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
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { loginGuard } from 'src/login/login.guard';
import { HttpExceptionFilter } from 'src/utils/http-exeption.filter';

@Controller('boards/:boardid/tasks')
@UseGuards(loginGuard)
@UseFilters(HttpExceptionFilter)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Param('boardid') boardId: string,
  ) {
    try {
      return this.tasksService.create(boardId, createTaskDto);
    } catch (err) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  findAll(@Param('boardid') boardId: string) {
    try {
      return this.tasksService.findAll(boardId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':taskid')
  async findOne(
    @Param('taskid') taskId: string,
    @Param('boardid') boardId: string,
  ) {
    const task = await this.tasksService.findOne(boardId, taskId);
    if (task !== undefined) return task;
    throw new HttpException('not found', HttpStatus.NOT_FOUND);
  }

  @Put(':taskid')
  update(
    @Param('taskid') taskId: string,
    @Param('boardid') boardId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      return this.tasksService.update(boardId, taskId, updateTaskDto);
    } catch (err) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':taskid')
  remove(@Param('taskid') id: string, @Res() res: Response) {
    try {
      return this.tasksService.remove(id, res);
    } catch (err) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }
}
