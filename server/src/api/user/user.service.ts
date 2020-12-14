import {Injectable} from '@nestjs/common';
import {UserManager} from "../../database/manager/user.manager";
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";

@Injectable()
export class UserService {

    constructor(private userRepository: UserManager) {
    }

    async GetAllBy(pageNumber: number, pageSize: number, keyText: string,email,address,status) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.userRepository.GetAllBy(pageSize, pageNumber, keyText,email,address,status)
            const {count} = (await this.userRepository.CountAllBy(email,address,status))[0]

            response.data = {list, count};

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async GetRoleByUserID(id: number) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const list = await this.userRepository.GetRoleByUserID(id)
            response.data = list;

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async UpdateUserRole(id: any, role_ids) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            if (id == 10893) {
                throw new Error("Permission denied")
            }
            const result = await this.userRepository.UpdateUserRole(id, role_ids.join(','))

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
