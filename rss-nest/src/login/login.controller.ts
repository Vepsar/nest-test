import { Controller, Post, Body, Res, HttpException } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async create(@Body() createLoginDto: CreateLoginDto) {
    const token = { token: await this.loginService.getToken(createLoginDto) };
    if (token !== undefined) return token;
  }
}
