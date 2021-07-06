import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  title: string;
  order: number;
  description: string;
  userId: string;
  //   boardId: string;
  columnId: string;
}
