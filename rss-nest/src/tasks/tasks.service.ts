import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async create(boardId: string, createTaskDto: CreateTaskDto) {
    const data = { ...createTaskDto, boardId };
    const newTask = this.taskRepo.create(data);
    const savedTask = await this.taskRepo.save(newTask);
    return this.taskRepo.findOne(savedTask.id);
  }

  async findAll(id: string): Promise<Task[]> {
    return await this.taskRepo.find({ where: { boardId: `${id}` } });
  }

  async findOne(boardId: string, taskId: string): Promise<Task | HttpStatus> {
    if (taskId === undefined || boardId === undefined) {
      return HttpStatus.NOT_FOUND;
    }
    return await this.taskRepo.findOne({
      where: { id: taskId, boardId: boardId },
    });
  }

  async update(
    boardId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | undefined> {
    const resp = this.taskRepo.findOne(taskId);
    if (taskId === undefined || boardId === undefined || resp === undefined) {
      return undefined;
    }
    const updTask = await this.taskRepo.update(taskId, updateTaskDto);
    return updTask.raw;
  }

  async remove(taskId: string, res: Response) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    if (taskId !== undefined && task !== undefined) {
      const deleted = await this.taskRepo.delete({ id: `${taskId}` });
      if (deleted.affected) res.status(204).send();
    }
    res.status(404).send();
  }

  async deleteBoard(boardId: string) {
    const tasks = await this.taskRepo.find({ where: { boardId } });
    if (tasks !== undefined) {
      Promise.all(
        tasks.map(async (task: Task): Promise<void> => {
          await this.taskRepo.delete(task.id);
        }),
      );
      return undefined;
    }
  }

  async deleteUser(userId: string | undefined): Promise<void | undefined> {
    const tasks = await this.taskRepo.find({ where: { userId } });
    if (tasks !== undefined) {
      Promise.all(
        tasks.map(async (task: Task): Promise<void> => {
          if (task.id !== undefined)
            await this.taskRepo.update(
              task.id,
              Object.assign({ userId: null }),
            );
        }),
      );
    }
    return undefined;
  }
}
