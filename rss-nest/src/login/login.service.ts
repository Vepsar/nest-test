import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { createToken } from 'src/utils/authmiddle';
import { chechHash } from 'src/utils/hashmiddle';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  constructor(private UserService: UsersService) {}

  async getToken(createLoginDto: CreateLoginDto): Promise<string | undefined> {
    const user = await this.UserService.getUserByLogin(createLoginDto.login);
    if (user !== undefined) {
      const { id, login } = user;
      const { password: hashPassword } = user;
      const compare = await chechHash(createLoginDto.password, hashPassword);
      if (compare) {
        const token: string = await createToken(id, login);
        return token;
      }
    }
    return undefined;
  }
}
