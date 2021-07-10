import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class loginGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      if (authHeader !== undefined) {
        const [connect, token] = authHeader.split(' ');
        if (connect !== 'Bearer') {
          throw new UnauthorizedException('UNAUTARIZED_ACCESS');
        } else {
          if (token !== undefined) {
            this.jwtService.verify(token, { ignoreExpiration: true });
            return true;
          }
        }
        return false;
      } else {
        throw new UnauthorizedException('UNAUTARIZED_ACCESS');
      }
    } catch (e) {
      throw new UnauthorizedException('UNAUTARIZED_ACCESS');
    }
  }
}
