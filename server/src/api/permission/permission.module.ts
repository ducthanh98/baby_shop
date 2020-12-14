import {Module} from '@nestjs/common';
import {PermissionController} from './permission.controller';
import {PermissionService} from './permission.service';
import {AuthManager} from "../../database/manager/auth.manager";
import {databaseProviders} from "../../database/providers/database.providers";
import {PermissionManager} from "../../database/manager/permission.manager";

@Module({
    controllers: [PermissionController],
    providers: [PermissionService, AuthManager, ...databaseProviders, PermissionManager]
})
export class PermissionModule {
}
