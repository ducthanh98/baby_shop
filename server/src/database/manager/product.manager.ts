import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class ProductManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAllBy(pageSize: number, pageNumber: number, keyText: string) {
        return this.manager.query("EXEC sp_product_get_all_by @0,@1,@2", [pageSize, pageNumber, keyText])
    }

    GetPopular() {
        return this.manager.query("EXEC sp_product_get_popular")
    }

    GetByID(id) {
        return this.manager.query("EXEC sp_product_get_by_id @0",[id])
    }

    CreateOrder({product_variant_id,quantity,user_id}){
        return this.manager.query("EXEC sp_order_create @0,@1,@2",[product_variant_id,quantity,user_id])
    }

    CountAllBy(keyText: string) {
        return this.manager.query("EXEC sp_product_count_all_by @0", [keyText])
    }
}
