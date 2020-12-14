import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";
import {ProductManager} from "../../database/manager/product.manager";

const sql = require('mssql')

@Injectable()
export class ProductService implements OnModuleInit,OnModuleDestroy{
    constructor(private productManager: ProductManager) {
    }

    async onModuleInit() {
        await sql.connect('mssql://sa:14101993aA!@localhost/baby_shop')
    }

    onModuleDestroy(): any {
        sql.close()
    }


    async GetAllBy(pageSize: number, pageNumber: number, keyText: string) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const result = await this.productManager.GetAllBy(pageSize, pageNumber, keyText)
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

            const {count} = (await this.productManager.CountAllBy(keyText))[0]

            response.data = {list, count};

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetPopularProduct() {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
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
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const result = await this.productManager.GetByID(id)
            response.data = result;

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async CreateOrder(body) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            await this.productManager.CreateOrder(body)

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async CreateProduct({attributes, variants, name, path, description}) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
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

            for (let i = 0; i < variants.length; i++) {
                console.log(variants[i].price)
                variantTable.rows.add(variants[i].attribute1_value, variants[i].attribute2_value, variants[i].attribute3_value, variants[i].attribute1_name, variants[i].attribute2_name, variants[i].attribute3_name, variants[i].price, variants[i].quantity)
            }

            const request = new sql.Request()
            request.input('attributes', attributeTable)
            request.input('product_variants', variantTable)
            request.input('name', name)
            request.input('path', path)
            request.input('category_id', 1)
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
}
