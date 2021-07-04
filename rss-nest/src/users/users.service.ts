import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponceDto } from './dto/user-responce.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponceDto> {
    const newUser = this.userRepo.create(createUserDto);
    const savedUser = this.userRepo.save(newUser);
    return User.toResponse(await this.userRepo.findOne((await savedUser).id));
  }

  async findAll(): Promise<UserResponceDto[]> {
    const users = await this.userRepo.find({ where: {} });
    const respUsers = users.map(User.toResponse);
    return respUsers;
  }

  async findOne(id: string) {
    return User.toResponse(await this.userRepo.findOne(id));
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponceDto> {
    // const resp = await this.userRepo.findOne(id);
    // if (resp === undefined || id == undefined) return undefined;
    const updUser = await this.userRepo.update(id, updateUserDto);
    console.log(User.toResponse(updUser.raw));

    return User.toResponse(updUser.raw);
  }

  async remove(id: string): Promise<'deleted' | 'not_found'> {
    // await deleteByUserId(id);
    const resp = this.userRepo.findOne(id);
    if (id !== undefined && resp !== undefined) {
      await this.userRepo.delete(id);
      return 'deleted';
    }
    return 'not_found';
  }

  async getUserByLogin(login: string): Promise<User | undefined> {
    const usersarr = await this.userRepo.find({ where: {} });
    const resp = usersarr.find((user) => user.login === login);
    if (resp !== undefined) {
      return resp;
    }
    return undefined;
  }
}

// const getAll = async (): Promise<User[] | undefined> => {
//   const userRepo = getRepository(User);
//   return await userRepo.find({ where: {} });
// };

// const getById = async (id: string | undefined): Promise<User | undefined> => {
//   const userRepo = getRepository(User);
//   return userRepo.findOne(id);
// };

// const postUser = async (data: IUserResp): Promise<User | undefined> => {
//   const userRepo = getRepository(User);
//   const newUser = userRepo.create(data);
//   const savedUser = userRepo.save(newUser);

//   return userRepo.findOne((await savedUser).id);
// };

// const deleteUser = async (
//   id: string | undefined
// ): Promise<'deleted' | 'not_found'> => {
//   await deleteByUserId(id);
//   const userRepo = getRepository(User);
//   const resp = userRepo.findOne(id);
//   if (id !== undefined && resp !== undefined) {
//     await userRepo.delete(id);
//     return 'deleted';
//   }
//   return 'not_found';
// };

// const updateUser = async (
//   id: string | undefined,
//   data: IUserRequest
// ): Promise<User | undefined> => {
//   const userRepo = getRepository(User);
//   const resp = await userRepo.findOne(id);
//   if (resp === undefined || id == undefined) return undefined;
//   const updUser = await userRepo.update(id, data);
//   return updUser.raw;
// };

// export { getAll, getById, postUser, deleteUser, updateUser, getUserByLogin };
