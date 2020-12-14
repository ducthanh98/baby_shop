import {Controller, Get, Param, Query, SetMetadata, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthGuard} from "../../shared/guards/auth.guard";
import {PERMISSION_KEY, PERMISSION_PERMISSION} from "../../constant/permissions";
import {PermissionService} from "./permission.service";

@Controller('permission')
export class PermissionController {
    constructor(private permissionService: PermissionService) {
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, PERMISSION_PERMISSION)
    @Get('')
    GetAllBy() {
        return this.permissionService.GetAll()
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, PERMISSION_PERMISSION)
    @Get('/:id')
    GetPermissionByRoleID(@Param('id') id: number = 0) {
        return this.permissionService.GetPermissionByUserID( id)
    }
}
