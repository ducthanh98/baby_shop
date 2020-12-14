import {Controller, Get} from '@nestjs/common';
import {StatisticalService} from "./statistical.service";

@Controller('statistical')
export class StatisticalController {
    constructor(private statisticalService:StatisticalService) {
    }
    @Get('')
    Statistical(){
        return this.statisticalService.Statistical()
    }
}
