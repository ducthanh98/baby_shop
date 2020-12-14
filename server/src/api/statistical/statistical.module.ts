import { Module } from '@nestjs/common';
import { StatisticalController } from './statistical.controller';
import { StatisticalService } from './statistical.service';
import {UserManager} from "../../database/manager/user.manager";
import {databaseProviders} from "../../database/providers/database.providers";
import {AuthService} from "../auth/auth.service";
import {AuthManager} from "../../database/manager/auth.manager";
import {StatisticalManager} from "../../database/manager/statistical.manager";

@Module({
  controllers: [StatisticalController],
  providers: [StatisticalService,StatisticalManager, ...databaseProviders, AuthService, AuthManager]
})
export class StatisticalModule {}
