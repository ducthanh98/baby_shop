import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import {ConfigModule} from "@nestjs/config";
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
      ApiModule,
      ConfigModule.forRoot(),
      WebsocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
