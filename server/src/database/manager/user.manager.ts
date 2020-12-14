import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class UserManager {
    private manager : EntityManager;
    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAllBy(pageSize: number, pageNumber: number, keyText: string,email,address,status) {
        return this.manager.query("EXEC sp_user_get_all_by @0,@1,@2,@3,@4",[email,address,status,pageSize,pageNumber] )
    }

    GetRoleByUserID(id:number) {
        return this.manager.query("EXEC sp_get_role_by_user_id @0",[id] )
    }

    UpdateUserRole(id,role_ids) {
        return this.manager.query("EXEC sp_update_user_role @0,@1",[id,role_ids] )
    }

    CountAllBy(email,address,status) {
        return this.manager.query("EXEC sp_user_count_all_by @0,@1,@2",[email,address,status] )
    }
}
