import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class PermissionManager {
    private manager : EntityManager;
    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAll() {
        return this.manager.query("EXEC sp_permission_get_all" )
    }

    GetPermissionByUserID(id: number) {
        return this.manager.query("EXEC sp_get_permissions_by_user_id @0", [id])
    }
}
