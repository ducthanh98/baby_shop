import {Body, Controller, Get, Post, Req, Res, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDTO} from "./dto/login.dto";
import { Request } from 'express';
import {AuthManager} from "../../database/manager/auth.manager";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,private authRepository:AuthManager) {}

    @Post('/login')
    login(@Req() req: Request,  @Body() data: LoginDTO) {
        return this.authService.login(data)
    }

    @Post('/register')
    register(@Req() req: Request,  @Body() data) {
        return this.authService.register(data)
    }

}
