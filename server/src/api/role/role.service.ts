import {Body, Injectable} from '@nestjs/common';
import {RoleManager} from "../../database/manager/role.manager";
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";

@Injectable()
export class RoleService {
    constructor(private roleManager: RoleManager) {
    }

    async GetAll() {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.roleManager.GetAllRole()
            response.data = list;

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetAllPermissionByRoleID(id) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await Promise.all([this.roleManager.GetPermissionByRoleID(id),this.roleManager.GetRoleByID(id)])
            if(!list[1].length){
                throw new Error('Not found')
            }
            response.data = {permissions : list[0],role: list[1][0]};

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async UpdateRolePermission(id: any, body) {
        body.permission_ids = body.ids.join(',')
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            if (id == 1) {
                throw new Error("Permission denied")
            }
            const result = await this.roleManager.UpdateRolePermission(id, body)

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async CreateRole(body) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            const {name} = body
            await this.roleManager.CreateRole(name)

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
