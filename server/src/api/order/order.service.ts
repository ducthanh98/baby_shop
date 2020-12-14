import {Injectable} from '@nestjs/common';
import {OrderManager} from "../../database/manager/order.manager";
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";
import {WebsocketGateway} from "../../websockets/websocket.gateway";
import {UserManager} from "../../database/manager/user.manager";

const sql = require('mssql')


@Injectable()
export class OrderService {
    constructor(private orderManager: OrderManager, private websocketGateway: WebsocketGateway) {
    }

    async onModuleInit() {
        await sql.connect('mssql://sa:14101993aA!@localhost/baby_shop')
    }


    async GetAllBy(pageNumber: number, pageSize: number, id: string, email, status) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.orderManager.GetAllBy(pageSize, pageNumber, id, email, status)
            const {count} = (await this.orderManager.CountAllBy(id, email, status))[0]

            response.data = {list, count};

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async createOrder(body, userID) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            const {order_items} = body
            const orderItemTable = new sql.Table()
            orderItemTable.columns.add('product_variant_id', sql.Int())
            orderItemTable.columns.add('quantity', sql.Int())

            for (let i = 0; i < order_items.length; i++) {
                orderItemTable.rows.add(order_items[i].product_variant_id, order_items[i].quantity)
            }

            const request = new sql.Request()
            request.input('order_items', orderItemTable)
            request.input('first_name', body.last_name)
            request.input('last_name', body.last_name)
            request.input('email', body.email)
            request.input('phone', body.phone)
            request.input('address1', body.address1)
            request.input('address2', body.address2)
            request.input('user_id', userID)

            await request.execute('sp_order_create')
            this.websocketGateway.handleNotiNewOrder()

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response

    }

    async updateStatusOrder(body) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            const {id, status} = body;
            if (id < 1 || status < 1 || status > 3) {
                throw new Error("Order ID or status is invalid");
            }

            await this.orderManager.UpdateStatus(id, status)

        } catch (e) {
            console.log(e)
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response

    }
}
