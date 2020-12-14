import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class AuthManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    login(email: string, password: string) {
        return this.manager.query("EXEC sp_login @0,@1", [email, password])
    }

    register(email: string, password: string, first_name, last_name) {
        return this.manager.query("EXEC sp_user_create @0,@1,@2,@3", [email, password, first_name, last_name])
    }

    getPermissions(id: string) {
        return this.manager.query("EXEC sp_get_permissions_by_user_id @0", [id])
    }
}
