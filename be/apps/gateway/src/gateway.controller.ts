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
import { JwtAuthGuard } from '../passport/jwt-auth.guard';
@Controller('auth')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // passport tự redirect Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    console.log('call back running');
    try {
      const response = await this.gatewayService.googleLogin(req.user);
      res.cookie('access_token', response.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 1000 * 60 * 60 * 8,
      });
      return res.redirect(process.env.FRONTEND_SUCCESS_URL!);
    } catch (e) {
      return res.redirect(process.env.FRONTEND_ERROR_URL!);
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUser(@Req() req: Request) {
    return req.user;
  }
}
