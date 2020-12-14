import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {UserManager} from "../../database/manager/user.manager";
import {databaseProviders} from "../../database/providers/database.providers";
import {AuthService} from "../auth/auth.service";
import {AuthManager} from "../../database/manager/auth.manager";

@Module({
    controllers: [UserController],
    providers: [UserService, UserManager, ...databaseProviders, AuthService, AuthManager]
})
export class UserModule {
}
