import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
@Controller('auth')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
  @Public()
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.gatewayService.login(body);
  }
  @Public()
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.gatewayService.register(body);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // passport tự redirect Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    try {
      const { user, accessToken } = await this.gatewayService.googleLogin(
        req.user,
      );
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return res.redirect(process.env.FRONTEND_SUCCESS_URL!);
    } catch (e) {
      return res.redirect(process.env.FRONTEND_ERROR_URL!);
    }
  }
}
