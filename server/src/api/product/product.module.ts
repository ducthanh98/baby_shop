import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {AuthManager} from "../../database/manager/auth.manager";
import {databaseProviders} from "../../database/providers/database.providers";
import {ProductManager} from "../../database/manager/product.manager";

@Module({
  controllers: [ProductController],
  providers: [ProductService,AuthManager, ...databaseProviders, ProductManager]
})
export class ProductModule {}
