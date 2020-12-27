import { Inject, Injectable } from '@nestjs/common';
import { stat } from 'fs';
import { Connection, EntityManager } from "typeorm";

@Injectable()
export class ProductManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    GetAllBy(pageSize: number, pageNumber: number, keyText: string, priceFrom: number, priceTo: number, categoryID: number, sortBy: string, status: string) {
        return this.manager.query("EXEC sp_product_get_all_by @0,@1,@2,@3,@4,@5,@6,@7", [pageSize, pageNumber, keyText, priceFrom, priceTo, categoryID, sortBy, status])
    }

    GetPopular() {
        return this.manager.query("EXEC sp_product_get_popular")
    }

    GetByID(id) {
        return this.manager.query("EXEC sp_product_get_by_id @0", [id])
    }

    UpdateBase(id, name, status, category_id, path) {
        return this.manager.query("EXEC sp_product_base_update @0,@1,@2,@3,@4", [id, name, status, category_id, path])
    }

    UpdateVariant(id, price, quantity) {
        return this.manager.query("EXEC sp_product_variant_update @0,@1,@2", [id, price, quantity])
    }

    GetAllCategory() {
        return this.manager.query("EXEC sp_category_get_all")
    }

    CreateOrder({ product_variant_id, quantity, user_id }) {
        return this.manager.query("EXEC sp_order_create @0,@1,@2", [product_variant_id, quantity, user_id])
    }

    CountAllBy(keyText: string, priceFrom: number, priceTo: number, categoryID: number, status: string) {
        return this.manager.query("EXEC sp_product_count_all_by @0,@1,@2,@3,@4", [keyText, priceFrom, priceTo, categoryID, status])
    }
}
