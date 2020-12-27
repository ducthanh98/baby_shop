import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards,Put } from '@nestjs/common';
import { AuthGuard } from "../../shared/guards/auth.guard";
import { PERMISSION_KEY, PRODUCT_PERMISSION } from "../../constant/permissions";
import { ProductService } from "./product.service";

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {
    }

    @Get('')
    GetAllBy(@Query('pageNumber') pageNumber: number = 1, @Query('pageSize') pageSize: number = 10, @Query('keyText') search: string = '', @Query('price_from') price_from: number = 0, @Query('price_to') price_to: number = 0, @Query('category_id') category_id: number = 0, @Query('sort_by') sortBy: string = '', @Query('status') status: string = '') {
        return this.productService.GetAllBy(pageSize, pageNumber, search, price_from, price_to, category_id, sortBy, status)
    }

    @Get('/popular')
    GetPopular() {
        return this.productService.GetPopularProduct()
    }

    @Get('/category')
    GetAllCategory() {
        return this.productService.GetAllCategory();
    }

    @Get('/:id')
    GetByID(@Param('id') id: number) {
        return this.productService.GetByID(id)
    }


    @Post('')
    @SetMetadata<string, string>(PERMISSION_KEY, PRODUCT_PERMISSION)
    @UseGuards(AuthGuard)
    CreateProduct(@Body() body) {
        return this.productService.CreateProduct(body)
    }

    @Put('/base/:id')
    @SetMetadata<string, string>(PERMISSION_KEY, PRODUCT_PERMISSION)
    @UseGuards(AuthGuard)
    UpdateBase(@Param('id') id: number,@Body() body) {
        return this.productService.UpdateBase(id,body)
    }

    @Put('/variants/:id')
    @SetMetadata<string, string>(PERMISSION_KEY, PRODUCT_PERMISSION)
    @UseGuards(AuthGuard)
    UpdateVariant(@Param('id') id: number,@Body() body) {
        return this.productService.UpdateVariant(id,body)
    }
}
