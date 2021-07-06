import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteBoard } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(@InjectRepository(Board) private boardRepo: Repository<Board>) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const newBoard = this.boardRepo.create(createBoardDto);
    const savedBoard = this.boardRepo.save(newBoard);
    return this.boardRepo.findOne((await savedBoard).id);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepo.find({ where: {} });
  }

  async findOne(id: string): Promise<Board> {
    return await this.boardRepo.findOne(id);
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const resp = await this.boardRepo.findOne(id);
    if (resp === undefined || id == undefined) return undefined;
    const updBoard = await this.boardRepo.update(id, updateBoardDto);
    return updBoard.raw;
  }

  async remove(id: string): Promise<void | undefined> {
    await deleteBoard(id);
    const resp = await this.boardRepo.findOne(id);
    if (resp !== undefined && id !== undefined) {
      await this.boardRepo.delete(id);
      return;
    }
    return undefined;
  }
}
