import {Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {RoleManager} from "../../database/manager/role.manager";
import {databaseProviders} from "../../database/providers/database.providers";
import {AuthService} from "../auth/auth.service";
import {AuthManager} from "../../database/manager/auth.manager";
import {OrderManager} from "../../database/manager/order.manager";
import {WebsocketGateway} from "../../websockets/websocket.gateway";

@Module({
    controllers: [OrderController],
    providers: [OrderService, OrderManager, ...databaseProviders, AuthService, AuthManager, WebsocketGateway]
})
export class OrderModule {
}
