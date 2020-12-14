import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {AuthManager} from "../database/manager/auth.manager";
import {databaseProviders} from "../database/providers/database.providers";
import {UserModule} from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { ProductModule } from './product/product.module';
import { StatisticalModule } from './statistical/statistical.module';
import {FilesModule} from "./files/files.module";
import { OrderModule } from './order/order.module';
import {WebsocketsModule} from "../websockets/websockets.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        PermissionModule,
        RoleModule,
        ProductModule,
        StatisticalModule,
        FilesModule,
        OrderModule,
        WebsocketsModule
    ],
    providers: [
        AuthManager,
        ...databaseProviders
    ]

})
export class ApiModule {
}
