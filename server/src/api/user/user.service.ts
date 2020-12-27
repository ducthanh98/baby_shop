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

    async GetUserByID(id: number) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {

            const result = await Promise.all([this.userRepository.GetRoleByUserID(id),this.userRepository.GetUserByID(id)])
            if(!result[1].length){
                throw new Error("Not found")
            }
            response.data = {user:result[1][0],permissions:result[0]};

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async UpdateUser(id: any, body) {
        console.log(body)
        body.ids = body.ids.join(',');
        body.password = body.password.trim();
        body.password = body.password ? body.password : null;
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
        try {
            if (id == 10893) {
                throw new Error("Permission denied")
            }
            const result = await this.userRepository.UpdateUser(id, body)

        } catch (e) {
            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
