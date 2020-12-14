import {Body, Controller, Get, Param, Put, Query, Req, SetMetadata, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {Request} from "express";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {PERMISSION_KEY, PERMISSION_PERMISSION, USER_PERMISSION} from "../../constant/permissions";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, USER_PERMISSION)
    @Get('')
    GetAllBy(@Query('pageNumber') pageNumber: number = 1, @Query('pageSize') pageSize: number = 10, @Query('keyText') search: string = '', @Query('email') email: string = '', @Query('address') address: string = '', @Query('status') status: string = '') {
        return this.userService.GetAllBy(pageNumber, pageSize, search,email,address,status)
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, USER_PERMISSION)
    @Get('/:id')
    GetPermissionByUserID(@Param('id') id: number = 0) {
        return this.userService.GetRoleByUserID(id)
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, USER_PERMISSION)
    @Put('/:id')
    UpdateUser(@Param('id') id: number = 0, @Body() body: any) {
        return this.userService.UpdateUserRole(id, body.ids)
    }
}
