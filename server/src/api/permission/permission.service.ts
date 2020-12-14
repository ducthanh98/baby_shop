import {Injectable, Param} from '@nestjs/common';
import {PermissionManager} from "../../database/manager/permission.manager";
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";

@Injectable()
export class PermissionService {
    constructor(private permissionManager: PermissionManager) {
    }

    async GetAll() {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.permissionManager.GetAll()
            response.data = list;

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetPermissionByUserID(id: number) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.permissionManager.GetPermissionByUserID(id)
            response.data = list;

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
