import {Body, Controller, Get, Param,Post, Put, Query, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../../shared/guards/auth.guard";
import {PERMISSION_KEY, ROLE_PERMISSION, USER_PERMISSION} from "../../constant/permissions";
import {RoleService} from "./role.service";

@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @UseGuards(AuthGuard)
    @Get('')
    GetAllBy() {
        return this.roleService.GetAll()
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, ROLE_PERMISSION)
    @Get('/:id')
    GetPermissionByRoleID(@Param('id') id: number = 0) {
        return this.roleService.GetAllPermissionByRoleID(id)
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, ROLE_PERMISSION)
    @Put('/:id')
    UpdateUserRole(@Param('id') id: number = 0, @Body() body: any) {
        return this.roleService.UpdateRolePermission(id, body)
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, ROLE_PERMISSION)
    @Post('')
    CreateRole(@Body() body: any) {
        return this.roleService.CreateRole(body)
    }


}
