import {Module} from '@nestjs/common';
import {AuthManager} from './manager/auth.manager';
import {databaseProviders} from './providers/database.providers'
import {UserManager} from "./manager/user.manager";
import {RoleManager} from "./manager/role.manager";
import {ProductManager} from "./manager/product.manager";

@Module({
    providers: [
        AuthManager,
        UserManager,
        ...databaseProviders,
        RoleManager,
        ProductManager
    ],
    exports: [
        AuthManager,
        UserManager,
        ...databaseProviders,
        RoleManager,
        ProductManager

    ]
})
export class DatabaseModule {
}
