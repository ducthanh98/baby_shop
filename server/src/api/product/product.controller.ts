import {Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../../shared/guards/auth.guard";
import {ORDER_PERMISSION, PERMISSION_KEY, PRODUCT_PERMISSION} from "../../constant/permissions";
import {ProductService} from "./product.service";

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {
    }

    @Get('')
    GetAllBy(@Query('pageNumber') pageNumber: number = 1, @Query('pageSize') pageSize: number = 10, @Query('keyText') search: string = '') {
        return this.productService.GetAllBy(pageSize,pageNumber,search)
    }

    @Get('/popular')
    GetPopular() {
        return this.productService.GetPopularProduct()
    }

    @Get('/:id')
    GetByID(@Param('id') id:number) {
        return this.productService.GetByID(id)
    }


    @Post('')
    @SetMetadata<string, string>(PERMISSION_KEY, PRODUCT_PERMISSION)
    @UseGuards(AuthGuard)
    CreateProduct(@Body() body) {
        return this.productService.CreateProduct(body)
    }
}
