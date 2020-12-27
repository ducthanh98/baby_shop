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

    GetUserByID(id:number) {
        return this.manager.query("EXEC sp_get_user_by_id @0",[id] )
    }

    UpdateUser(id,{firstname,lastname,address,password,ids,status}) {
        const role_ids = ids;
        return this.manager.query("EXEC sp_user_update @0,@1,@2,@3,@4,@5,@6",[id,firstname,lastname,address,status,password,role_ids] )
    }

    CountAllBy(email,address,status) {
        return this.manager.query("EXEC sp_user_count_all_by @0,@1,@2",[email,address,status] )
    }
}
