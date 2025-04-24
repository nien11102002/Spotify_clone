import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_NAME') private userService: ClientProxy) {}

  @Public()
  @Post(`/login`)
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    try {
      const loginUser = await lastValueFrom(
        this.userService.send('login', loginDto).pipe(
          catchError((err) => {
            const { statusCode = 500, message = 'Internal server error' } = err;
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
      return loginUser;
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post(`/register`)
  async register(@Body() registerDto: RegisterDto) {
    try {
      let registerUser = await lastValueFrom(
        this.userService.send('register', registerDto).pipe(
          catchError((err) => {
            const { statusCode = 500, message = 'Internal server error' } = err;
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
      return registerUser;
    } catch (err) {
      throw err;
    }
  }
}
