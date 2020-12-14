import { Injectable } from '@nestjs/common';
import {StatisticalManager} from "../../database/manager/statistical.manager";
import {IResponse} from "../../shared/IResponse";
import {Message} from "../../constant/message";
import {Code} from "../../constant/code.enum";

@Injectable()
export class StatisticalService {
    constructor(private statisticManager:StatisticalManager) {
    }

    async Statistical(){
            const response: IResponse<any> = {message: Message.SUCCESS, statusCode: Code.SUCCESS}
            try {

                const list = await this.statisticManager.StatisticalDashboard()
                console.log(list)
                response.data = list

            } catch (e) {

                response.statusCode = Code.ERROR
                response.message = e.message || Message.ERROR

            }
            return response
    }
}
