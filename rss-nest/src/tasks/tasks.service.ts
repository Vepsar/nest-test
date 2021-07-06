import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
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

  async remove(taskId: string): Promise<'delete' | HttpStatus> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
    });
    if (taskId !== undefined && task !== undefined) {
      const deleted = await this.taskRepo.delete({ id: `${taskId}` });
      if (deleted.affected) return 'delete';
    }
    return HttpStatus.NOT_FOUND;
  }
}

const deleteUser = async (
  userId: string | undefined,
): Promise<void | undefined> => {
  const taskRepo = getRepository(Task);
  const tasks = await taskRepo.find({ where: { userId } });
  if (tasks !== undefined) {
    Promise.all(
      tasks.map(async (task: Task): Promise<void> => {
        if (task.id !== undefined)
          await taskRepo.update(task.id, Object.assign({ userId: null }));
      }),
    );
  }
  return undefined;
};

const deleteBoard = async (boardId: string) => {
  const taskRepo = getRepository(Task);
  const tasks = await taskRepo.find({ where: { boardId } });
  if (tasks !== undefined) {
    Promise.all(
      tasks.map(async (task: Task): Promise<void> => {
        await taskRepo.delete(task.id);
      }),
    );
    return undefined;
  }
};

export { deleteUser, deleteBoard };
