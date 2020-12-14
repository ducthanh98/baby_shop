import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {DatabaseModule} from "../../database/database.module";
import {AuthManager} from "../../database/manager/auth.manager";
import {databaseProviders} from "../../database/providers/database.providers";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService, AuthManager, ...databaseProviders
    ]
})
export class AuthModule {

}
