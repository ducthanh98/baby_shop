import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class OrderManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAllBy(pageSize: number, pageNumber: number, id: string, email: string, status: number) {
        console.log(id, email, status, pageSize, pageNumber)
        return this.manager.query("EXEC sp_order_get_all_by @0,@1,@2,@3,@4", [id, email, status, pageSize, pageNumber])
    }

    CountAllBy(id: string, email: string, status: number) {
        return this.manager.query("EXEC sp_order_count_all_by @0,@1,@2", [id, email, status])
    }

    UpdateStatus(id: string, status: number) {
        return this.manager.query("EXEC sp_order_update_status @0,@1", [id, status])
    }
}
