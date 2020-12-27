import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";
import {log} from "util";

@Injectable()
export class RoleManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAllRole() {
        return this.manager.query("EXEC sp_role_get_all")
    }

    GetPermissionByRoleID(id) {
        return this.manager.query("EXEC sp_get_permission_by_role_id @0", [id])
    }

    GetRoleByID(id) {
        return this.manager.query("EXEC sp_role_get_by_id @0", [id])
    }

    UpdateRolePermission(id,{permission_ids,name,status}) {
        return this.manager.query("EXEC sp_update_role_permission @0,@1,@2,@3", [id,name,status,permission_ids])
    }

    CreateRole(name) {
        return this.manager.query("EXEC sp_create_role @0", [name])
    }
}
