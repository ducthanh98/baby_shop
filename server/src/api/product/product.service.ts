import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IResponse } from "../../shared/IResponse";
import { Message } from "../../constant/message";
import { Code } from "../../constant/code.enum";
import { ProductManager } from "../../database/manager/product.manager";

const sql = require('mssql')

@Injectable()
export class ProductService implements OnModuleInit, OnModuleDestroy {
    constructor(private productManager: ProductManager) {
    }

    async onModuleInit() {
        await sql.connect('mssql://sa:14101993aA!@localhost/baby_shop')
    }

    onModuleDestroy(): any {
        sql.close()
    }


    async GetAllBy(pageSize: number, pageNumber: number, keyText: string, priceFrom: number, priceTo: number, categoryID: number, sortBy: string, status: string): Promise<IResponse<any>> {
        priceTo = priceTo == 0 ? null : priceTo;
        priceFrom = priceFrom == 0 ? null : priceFrom;
        categoryID = categoryID == 0 ? null : categoryID;
        keyText = keyText.trim() == '' ? null : keyText;
        sortBy = sortBy.trim() == '' ? null : sortBy;
        status = status.trim() == '' ? null : status;



        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {

            const result = await this.productManager.GetAllBy(pageSize, pageNumber, keyText, priceFrom, priceTo, categoryID, sortBy, status)
            const list = []
            for (let i = 0; i < result.length; i++) {
                const index = list.findIndex(x => x.id === result[i].id)
                if (index < 0) {
                    const tmp = {
                        id: result[i].id,
                        name: result[i].name,
                        price_from: result[i].price_from,
                        price_to: result[i].price_to,
                        path: result[i].path,
                        attributes: {
                            [result[i].attribute1_name]: [result[i].attribute1_value],
                            [result[i].attribute2_name]: [result[i].attribute2_value],
                        }

                    }
                    list.push(tmp)
                    continue
                }

                list[index].attributes[result[i].attribute1_name].push(result[i].attribute1_value)
                list[index].attributes[result[i].attribute2_name].push(result[i].attribute2_value)

                list[index].attributes[result[i].attribute1_name] = [...new Set(list[index].attributes[result[i].attribute1_name])]
                list[index].attributes[result[i].attribute2_name] = [...new Set(list[index].attributes[result[i].attribute2_name])]

            }

            const { count } = (await this.productManager.CountAllBy(keyText, priceFrom, priceTo, categoryID, status))[0]

            response.data = { list, count };

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetPopularProduct(): Promise<IResponse<any>> {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {
            const result = await this.productManager.GetPopular()
            const list = []
            for (let i = 0; i < result.length; i++) {
                const index = list.findIndex(x => x.id === result[i].id)
                if (index < 0) {
                    const tmp = {
                        id: result[i].id,
                        name: result[i].name,
                        path: result[i].path,
                        attributes: {
                            [result[i].attribute1_name]: [result[i].attribute1_value],
                            [result[i].attribute2_name]: [result[i].attribute2_value],
                            [result[i].attribute3_name]: [result[i].attribute3_value],

                        }

                    }
                    list.push(tmp)
                    continue
                }

                list[index].attributes[result[i].attribute1_name].push(result[i].attribute1_value)
                list[index].attributes[result[i].attribute2_name].push(result[i].attribute2_value)
                list[index].attributes[result[i].attribute3_name].push(result[i].attribute3_value)

                list[index].attributes[result[i].attribute1_name] = [...new Set(list[index].attributes[result[i].attribute1_name])]
                list[index].attributes[result[i].attribute2_name] = [...new Set(list[index].attributes[result[i].attribute2_name])]
                list[index].attributes[result[i].attribute3_name] = [...new Set(list[index].attributes[result[i].attribute3_name])]

            }

            response.data = list;

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetByID(id) {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {

            const result = await this.productManager.GetByID(id)
            response.data = result;

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetAllCategory() {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {

            const result = await this.productManager.GetAllCategory();
            console.log(result)
            response.data = result;

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async CreateOrder(body) {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {

            await this.productManager.CreateOrder(body)

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async CreateProduct({ attributes, variants, name, path, description ,category_id}) {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {
            const attributeTable = new sql.Table()
            attributeTable.columns.add('name', sql.NVarChar(255))
            attributeTable.columns.add('value', sql.NVarChar(255))

            const variantTable = new sql.Table()
            variantTable.columns.add('attribute1_value', sql.NVarChar(255))
            variantTable.columns.add('attribute2_value', sql.NVarChar(255))
            variantTable.columns.add('attribute3_value', sql.NVarChar(255))
            variantTable.columns.add('attribute1_name', sql.NVarChar(255))
            variantTable.columns.add('attribute2_name', sql.NVarChar(255))
            variantTable.columns.add('attribute3_name', sql.NVarChar(255))
            variantTable.columns.add('price', sql.Decimal(18, 1))
            variantTable.columns.add('quantity', sql.Int)


            for (let i = 0; i < attributes.length; i++) {
                attributeTable.rows.add(attributes[i].name, attributes[i].value)
            }

            let min =Number.MAX_SAFE_INTEGER,max = 0;

            for (let i = 0; i < variants.length; i++) {
                if(min > variants[i].price) {
                    min = variants[i].price;
                }

                if(max < variants[i].price) {
                    max = variants[i].price;
                }

                variantTable.rows.add(variants[i].attribute1_value, variants[i].attribute2_value, variants[i].attribute3_value, variants[i].attribute1_name, variants[i].attribute2_name, variants[i].attribute3_name, variants[i].price, variants[i].quantity)
            }

            const request = new sql.Request()
            request.input('attributes', attributeTable)
            request.input('product_variants', variantTable)
            request.input('name', name)
            request.input('path', path)
            request.input('category_id', category_id)
            request.input('price_from', min)
            request.input('price_to', max)

            request.input('description', description)
            request.input('type', 1)
            await request.execute('sp_create_product')

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async UpdateBase(id, { name, status, category_id, path }) {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {
            await this.productManager.UpdateBase(id, name, status, category_id, path)

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async UpdateVariant(id, { price, quantity }) {
        const response: IResponse<any> = { message: Message.SUCCESS, statusCode: Code.SUCCESS }
        try {
            await this.productManager.UpdateVariant(id, price, quantity)

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
