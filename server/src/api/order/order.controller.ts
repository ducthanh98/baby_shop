import {Body, Controller, Get, Post, Put, Query, Req, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../../shared/guards/auth.guard";
import {OrderService} from "./order.service";
import {ORDER_PERMISSION, PERMISSION_KEY, USER_PERMISSION} from "../../constant/permissions";

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {
    }

    @UseGuards(AuthGuard)
    @SetMetadata<string, string>(PERMISSION_KEY, USER_PERMISSION)
    @Get('')
    GetAllBy(@Query('pageNumber') pageNumber: number = 1, @Query('pageSize') pageSize: number = 10, @Query('id') id: string = '', @Query('email') email: string = '', @Query('status') status: string = '') {
        return this.orderService.GetAllBy(pageNumber, pageSize, id, email, status)
    }

    @Post('')
    @UseGuards(AuthGuard)
    CreateOrder(@Body() body, @Req() req) {

        return this.orderService.createOrder(body, req.user)
    }

    @Put('')
    @SetMetadata<string, string>(PERMISSION_KEY, ORDER_PERMISSION)
    @UseGuards(AuthGuard)
    UpdateStatusOrder(@Body() body) {

        return this.orderService.updateStatusOrder(body)
    }
}
