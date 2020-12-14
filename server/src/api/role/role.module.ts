import {Module} from '@nestjs/common';
import {RoleController} from './role.controller';
import {RoleService} from './role.service';
import {databaseProviders} from "../../database/providers/database.providers";
import {AuthService} from "../auth/auth.service";
import {AuthManager} from "../../database/manager/auth.manager";
import {RoleManager} from "../../database/manager/role.manager";

@Module({
    controllers: [RoleController],
    providers: [RoleService, RoleManager, ...databaseProviders, AuthService, AuthManager]
})
export class RoleModule {
}
