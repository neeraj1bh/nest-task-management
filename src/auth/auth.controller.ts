import { AuthService } from './auth.service';
import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }
  @Post('/signin')
  signIn(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
    return this.authService.signIn(authCredentialsDTO);
  }
}
