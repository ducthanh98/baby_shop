import {Injectable} from '@nestjs/common';
import {AuthManager} from "../../database/manager/auth.manager";
import {LoginDTO} from "./dto/login.dto";
import {IResponse} from "../../shared/IResponse";
import {Code} from "../../constant/code.enum";
import {Message} from "../../constant/message";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private authRepository: AuthManager) {
    }

    async login(data: LoginDTO) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}

        try {
            const user = await this.authRepository.login(data.email, data.password) as any
            if (user.length == 0) {
                throw new Error("User not found or not permission")
            }

            const token = jwt.sign({id: user[0].id}, process.env.TOKEN_SECRET, {expiresIn: '7d'})
            response.data = {access_token: token, user_info: user}

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }

    async register({first_name, last_name, email, password}) {
        const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}

        try {

            const user = await this.authRepository.register(email,password,first_name,last_name)

            const token = jwt.sign({id: user[0].id}, process.env.TOKEN_SECRET, {expiresIn: '7d'})
            response.data = {access_token: token, user_info: user}

        } catch (e) {

            response.statusCode = Code.ERROR
            response.message = e.message || Message.ERROR

        }
        return response
    }
}
