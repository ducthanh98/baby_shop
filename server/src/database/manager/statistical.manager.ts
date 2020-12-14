import {Inject, Injectable} from '@nestjs/common';
import {Connection, EntityManager} from "typeorm";

@Injectable()
export class StatisticalManager {
    private manager: EntityManager;

    constructor(@Inject('CONNECTION') private connection: Connection) {
        this.manager = this.connection.manager

    }

    StatisticalDashboard(){
        return this.manager.query("exec sp_dashboard_chat")
    }
}
